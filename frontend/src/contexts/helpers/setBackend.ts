import store from "../store"

export const initBackend = (randomSeed?: string) => {
  store.dispatch.backend.initialize({ randomSeed })
}

export const loginWithII = () => {
  store.dispatch.backend.login()
}

export const logout = () => {
  store.dispatch.backend.logout()
}

export const unsetBackend = () => store.dispatch.backend.UNSET()

export const fetchDecryptionKey = async () => {
  store.dispatch.backend.fetch_decryption_key()
}

export const fetchNotes = async () => {
  store.dispatch.backend.fetch_user_notes({})
}

export const fetchLogs = async () => {
  return store.dispatch.backend.fetch_logs()
}

export const fetchTimers = async () => {
  return store.dispatch.backend.fetch_timers()
}

export const editNoteIBE = async (id: bigint, note: string) => {
  store.dispatch.backend.edit_IBE_user_note({
    id,
    note,
  })
}

export const saveNoteIBE = async (note: string) => {
  store.dispatch.backend.save_IBE_user_note({ note })
}

export const saveNoteGCM = async (note: string) => {
  store.dispatch.backend.save_gcm_user_note({ note })
}

export const generateOneTimeLink = async (id: string) => {
  return store.dispatch.backend.generate_one_time_key({ id })
}

export const decyptIBENote = async (id: string, encryptedNote: Uint8Array) => {
  store.dispatch.backend.decrypt_IBE_user_note({ id, encryptedNote })
}

export const gcmDecrypt = async (encryptedNote: string) => {
  store.dispatch.backend.decrypt_gcm_user_note({ encryptedNote })
}

export const decyptWithSignature = async (id: string, signature: string) => {
  return store.dispatch.backend.decrypt_with_one_time_key({ id, signature })
}

export const requestOneTimeKey = async () => {
  store.dispatch.backend.request_one_time_key({})
}
