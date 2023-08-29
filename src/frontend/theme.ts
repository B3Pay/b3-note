import { blue, green, grey, pink, purple, red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: [
      "Gluten",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    fontSize: 12,
  },
  palette: {
    primary: {
      main: blue[300],
      light: blue[200],
      dark: blue[700],
      "100": blue[100],
      "200": blue[200],
      "300": blue[300],
      "400": blue[400],
      "500": blue[500],
      "600": blue[600],
      "700": blue[700],
      "800": blue[800],
      "900": blue[900],
    },
    info: {
      main: purple[300],
    },
    secondary: {
      main: pink[300],
    },
    error: {
      main: red[300],
    },
    success: {
      main: green[300],
    },
    background: {
      default: grey[300],
      paper: "#fff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
        },
      }),
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "8px 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          backgroundColor: grey[100],
          borderRight: "1px solid",
          borderColor: grey[200],
          "&.Mui-selected": {
            fontWeight: "bold",
            backgroundColor: "#fff",
          },
          "&:button": {
            borderRight: "1px solid",
          },
          "&:first-of-type": {
            borderStartStartRadius: "16px",
          },
          "&:last-of-type": {
            borderStartEndRadius: "16px",
            borderRight: "none",
          },
        },
      },
    },
    MuiCard: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            border: "2px solid",
            borderRadius: "4px",
            borderColor: grey[700],
            backgroundColor: blue[50],
          },
        },
        {
          props: { color: "secondary" },
          style: {
            border: "2px solid",
            borderRadius: "4px",
            borderColor: grey[700],
            backgroundColor: pink[50],
          },
        },
        {
          props: { color: "info" },
          style: {
            border: "2px solid",
            borderRadius: "4px",
            borderColor: grey[700],
            backgroundColor: purple[50],
          },
        },
      ],
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          textTransform: "uppercase",
          fontWeight: "bold",
        },
        root: {
          paddingBottom: "0",
          textAlign: "center",
        },
      },
    },
    MuiAccordionSummary: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            color: "black",
            backgroundColor: blue[300],
            "&:hover": {
              backgroundColor: blue[400],
            },
          },
        },
        {
          props: { color: "secondary" },
          style: {
            color: "black",
            backgroundColor: pink[300],
            "&:hover": {
              backgroundColor: pink[400],
            },
          },
        },
        {
          props: { color: "info" },
          style: {
            color: "black",
            backgroundColor: purple[300],
            "&:hover": {
              backgroundColor: purple[400],
            },
          },
        },
        {
          props: { color: "primary" },
          style: {
            color: blue[300],
            borderColor: blue[300],
            "&:hover": {
              backgroundColor: blue[50],
            },
          },
        },
        {
          props: { color: "secondary" },
          style: {
            color: pink[300],
            borderColor: pink[300],
            "&:hover": {
              backgroundColor: pink[50],
            },
          },
        },
      ],
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderWidth: "1px 2px",
          "&:first-of-type": {
            borderTop: "2px solid",
          },
          "&:last-of-type": {
            borderBottom: "2px solid",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
      variants: [
        {
          props: { color: "primary" },
          style: {
            backgroundColor: blue[50],
          },
        },
        {
          props: { color: "secondary" },
          style: {
            backgroundColor: pink[50],
          },
        },
        {
          props: { color: "info" },
          style: {
            backgroundColor: purple[50],
          },
        },
      ],
      defaultProps: {
        color: "secondary",
        variant: "outlined",
        style: {
          fontWeight: "bold",
          fontSize: "0.8rem",
          borderColor: grey[700],
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: blue[300],
              },
              "&:hover fieldset": {
                borderColor: blue[400],
              },
              "&.Mui-focused fieldset": {
                borderColor: blue[500],
              },
            },
          },
        },
        {
          props: { variant: "outlined", color: "secondary" },
          style: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: pink[300],
              },
              "&:hover fieldset": {
                borderColor: pink[400],
              },
              "&.Mui-focused fieldset": {
                borderColor: pink[500],
              },
            },
          },
        },
        {
          props: { variant: "outlined", color: "info" },
          style: {
            "& .MuiInputLabel-root.Mui-focused": {
              color: purple[300],
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: purple[300],
              },
              "&:hover fieldset": {
                borderColor: purple[400],
              },
              "&.Mui-focused fieldset": {
                borderColor: purple[500],
              },
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px",
              borderColor: grey[700],
            },
          },
        },
      },
      defaultProps: {
        variant: "outlined",
        size: "small",
        fullWidth: true,
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            color: "black",
            backgroundColor: blue[300],
            "&:hover": {
              backgroundColor: blue[400],
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            color: "black",
            backgroundColor: pink[300],
            "&:hover": {
              backgroundColor: pink[400],
            },
          },
        },
        {
          props: { variant: "contained", color: "info" },
          style: {
            color: "black",
            backgroundColor: purple[300],
            "&:hover": {
              backgroundColor: purple[400],
            },
          },
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            color: blue[300],
            borderColor: blue[300],
            "&:hover": {
              backgroundColor: blue[50],
            },
          },
        },
        {
          props: { variant: "outlined", color: "secondary" },
          style: {
            color: pink[300],
            borderColor: pink[300],
            "&:hover": {
              backgroundColor: pink[50],
            },
          },
        },
      ],
      defaultProps: {
        variant: "contained",
        fullWidth: true,
        style: {
          fontWeight: "bold",
          fontSize: "0.8rem",
          border: "2px solid",
          borderColor: grey[700],
        },
      },
    },
  },
})

export default theme