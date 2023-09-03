import { Identity, randomNumber } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { createModel } from "@rematch/core"
import { fetchNotes } from "contexts/helpers"
import type { UserNote } from "declarations/backend/backend.did"
import { hex_decode, hex_encode } from "helper/utils"
import { Backend, createBackendActor } from "service"
import { IBECiphertext, TransportSecretKey } from "vetkd-utils"
import { RootModel } from "../store"

interface BackendState {
  backend: Backend | null
  principal: Principal | null
  notes: UserNote[]
  secretKey: TransportSecretKey | null
  rawKey: Uint8Array | null
  decryptedNotes: {
    [x: string]: string
  }
  oneTimeKey: string | null
  initialized: boolean
}

const state: BackendState = {
  backend: null,
  principal: null,
  oneTimeKey: null,
  secretKey: null,
  rawKey: null,
  notes: [],
  decryptedNotes: {},
  initialized: false,
}

const backend = createModel<RootModel>()({
  name: "backend",
  state,
  reducers: {
    CREATE: (_, backend: Backend, principal: Principal) => ({
      backend,
      principal,
      notes: [],
      rawKey: null,
      secretKey: null,
      oneTimeKey: null,
      decryptedNotes: {},
      initialized: true,
    }),
    UNSET: () => ({ ...state, backend: null, initialized: false }),
    SET_NOTES: (state, notes) => ({ ...state, notes }),
    SET_SECRET_KEY: (state, secretKey) => ({ ...state, secretKey }),
    SET_RAW_KEY: (state, rawKey) => ({ ...state, rawKey }),
    SET_DECRYPTED_NOTES: (state, decryptedNotes) => ({
      ...state,
      decryptedNotes,
    }),
    DONE: (state) => ({ ...state }),
  },
  effects: (dispatch) => ({
    async initialize({ identity }: { identity?: Identity }, rootState) {
      if (rootState.backend.initialized) return

      let { actor, canisterId } = await createBackendActor(identity)

      dispatch.backend.CREATE(actor, canisterId)

      const seed = window.crypto.getRandomValues(new Uint8Array(32))
      const tsk = new TransportSecretKey(seed)

      dispatch.backend.SET_SECRET_KEY(tsk)

      const ek_bytes_hex = await actor.encrypted_symmetric_key_for_caller(
        tsk.public_key()
      )

      const pk_bytes_hex = await actor.symmetric_key_verification_key()

      const rawKey = tsk.decrypt_and_hash(
        hex_decode(ek_bytes_hex),
        hex_decode(pk_bytes_hex),
        Principal.anonymous().toUint8Array(),
        32,
        new TextEncoder().encode("aes-256-gcm")
      )

      dispatch.backend.SET_RAW_KEY(rawKey) // TODO: USE THIS TO ENCRYP AND DECRYPT
    },
    fetch_user_notes: async ({}, rootState) => {
      const backend = rootState.backend.backend

      if (!backend) {
        return
      }

      const notes = await backend.user_notes()
      console.log(notes)

      dispatch.backend.SET_NOTES(notes)
    },
    save_user_note: async ({ note }: { note: string }, rootState) => {
      const { backend, principal } = rootState.backend

      if (!backend || !principal) {
        return
      }

      const pk_bytes_hex = await backend.ibe_encryption_key()

      const message_encoded = new TextEncoder().encode(note)
      const seed = window.crypto.getRandomValues(new Uint8Array(32))

      const ibe_ciphertext = IBECiphertext.encrypt(
        hex_decode(pk_bytes_hex),
        Principal.anonymous().toUint8Array(),
        message_encoded,
        seed
      )

      let result = hex_encode(ibe_ciphertext.serialize())
      console.log(result)
      await backend.save_encrypted_text(result)

      fetchNotes()
    },
    gcm_decrypt: async (
      { encryptedNote }: { encryptedNote: string },
      rootState
    ) => {
      const { rawKey } = rootState.backend

      if (!rawKey) {
        return
      }

      const iv_and_ciphertext = hex_decode(encryptedNote)
      const iv = iv_and_ciphertext.subarray(0, 12) // 96-bits; unique per message
      const ciphertext = iv_and_ciphertext.subarray(12)
      const aes_key = await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        false,
        ["decrypt"]
      )
      let decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        aes_key,
        ciphertext
      )
      new TextDecoder().decode(decrypted)

      console.log({ decrypted })
    },
    decrypt_user_note: async (
      { encryptedNote }: { encryptedNote: string },
      rootState
    ) => {
      const { backend, principal } = rootState.backend

      if (!backend || !principal) {
        return
      }

      const seed = window.crypto.getRandomValues(new Uint8Array(32))

      const tsk = new TransportSecretKey(seed)

      console.log({ public_key: hex_encode(tsk.public_key()) })

      const ek_bytes_hex =
        await backend.encrypted_ibe_decryption_key_for_caller(tsk.public_key())

      const pk_bytes_hex = await backend.ibe_encryption_key()

      const k_bytes = tsk.decrypt(
        hex_decode(ek_bytes_hex),
        hex_decode(pk_bytes_hex),
        Principal.anonymous().toUint8Array()
      )

      let note = dispatch.backend.decrypt({
        encryptedNote,
        k_bytes,
      })

      dispatch.backend.SET_DECRYPTED_NOTES({
        "00000000": note,
      })
    },
    set_one_time_signature: async ({ id }: { id: Uint8Array }, rootState) => {
      const { backend, principal } = rootState.backend

      if (!backend || !principal) {
        return
      }

      // Generate a random seed
      const seed = window.crypto.getRandomValues(new Uint8Array(32))

      // Create a TransportSecretKey object
      const tsk = new TransportSecretKey(seed)

      const publicKey = hex_encode(tsk.public_key())

      console.log({ publicKey })

      // Sign the id using the TransportSecretKey
      const signature = tsk.sign(id)

      console.log({ signature: hex_encode(signature), id: hex_encode(id) })

      await backend.set_one_time_key(id, publicKey)

      fetchNotes()
    },
    decrypt_with_signature: async (
      {
        id,
        signature,
      }: {
        id: Uint8Array
        signature: string
      },
      rootState
    ) => {
      const { backend, principal } = rootState.backend

      if (!backend || !principal) {
        return
      }
      const seed = window.crypto.getRandomValues(new Uint8Array(32))

      const tsk = new TransportSecretKey(seed)

      const [encryptedNote, ek_bytes_hex] =
        await backend.read_with_one_time_key(
          id,
          signature,
          hex_encode(tsk.public_key())
        )

      const pk_bytes_hex = await backend.ibe_encryption_key()

      const k_bytes = tsk.decrypt(
        hex_decode(ek_bytes_hex),
        hex_decode(pk_bytes_hex),
        Principal.anonymous().toUint8Array()
      )

      let note = dispatch.backend.decrypt({
        encryptedNote,
        k_bytes,
      })

      console.log({ note })
    },
    request_one_time_key: async ({}, rootState) => {
      const { backend, principal } = rootState.backend

      if (!backend || !principal) {
        return
      }

      const seed = window.crypto.getRandomValues(new Uint8Array(32))
      const tsk = new TransportSecretKey(seed)

      try {
        const ek_bytes_hex = await backend.request_two_factor_authentication(
          tsk.public_key()
        )

        console.log({ public_key: hex_encode(tsk.public_key()) })

        const pk_bytes_hex = await backend.two_factor_verification_key()

        console.log({ pk_bytes_hex })

        const verification_key = tsk.decrypt_and_hash(
          hex_decode(ek_bytes_hex),
          hex_decode(pk_bytes_hex),
          Principal.anonymous().toUint8Array(),
          32,
          new TextEncoder().encode("aes-256-gcm")
        )

        console.log({ verification_key: hex_encode(verification_key) })
      } catch (e) {
        console.log(e)
      }
    },
    generate_one_time_key: async ({}, rootState) => {
      const { secretKey } = rootState.backend

      if (!secretKey) {
        return
      }

      const generate = () => {
        const randomRandom = randomNumber()

        const code = (randomRandom % 1000000).toString().padStart(6, "0")

        const signature = hex_encode(secretKey.sign(hex_decode(code)))

        console.log({ code, signature })
      }

      const interval = setInterval(generate, 30_000)
      generate()
    },
    decrypt: ({ encryptedNote, k_bytes }) => {
      const ibe_ciphertext = IBECiphertext.deserialize(
        hex_decode(encryptedNote)
      )
      const ibe_plaintext = ibe_ciphertext.decrypt(k_bytes)

      let decrypted = new TextDecoder().decode(ibe_plaintext)

      return decrypted
    },
    disconnect: (_, rootState) => {},
  }),
})

export default backend
