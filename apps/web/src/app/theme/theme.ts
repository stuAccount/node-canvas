import { createTheme, type PaletteMode } from "@mui/material/styles";

export const buildAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#12d978" : "#113d5a",
        dark: mode === "dark" ? "#0ca55c" : "#0b2f45",
        light: mode === "dark" ? "#58f0a4" : "#3d6782",
        contrastText: mode === "dark" ? "#101010" : "#f5efe6",
      },
      secondary: {
        main: mode === "dark" ? "#ff8c52" : "#d97941",
        dark: mode === "dark" ? "#d46836" : "#b85d28",
        light: mode === "dark" ? "#ffb085" : "#ec9a6a",
        contrastText: "#1f160f",
      },
      background: {
        default: mode === "dark" ? "#171717" : "#f3ede3",
        paper: mode === "dark" ? "#232323" : "#fffaf2",
      },
      text: {
        primary: mode === "dark" ? "#f3f3f3" : "#1f2d3a",
        secondary: mode === "dark" ? "#b5b5b5" : "#5c6670",
      },
      divider:
        mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(17, 61, 90, 0.16)",
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily:
        '"Avenir Next", "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
      h1: {
        fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
        lineHeight: 1.02,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      },
      h2: {
        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
        lineHeight: 1.08,
        fontWeight: 700,
        letterSpacing: "-0.03em",
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: 1.2,
        fontWeight: 700,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.7,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: "100vh",
            background:
              mode === "dark"
                ? "radial-gradient(circle at top left, rgba(18,217,120,0.1), transparent 30%), radial-gradient(circle at top right, rgba(255,140,82,0.08), transparent 25%), #171717"
                : "radial-gradient(circle at top left, rgba(217,121,65,0.18), transparent 28%), radial-gradient(circle at top right, rgba(17,61,90,0.14), transparent 24%), #f3ede3",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: "1rem",
          },
        },
      },
    },
  });
