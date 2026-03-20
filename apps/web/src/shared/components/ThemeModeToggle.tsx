import { Button, ButtonGroup, type SxProps, type Theme } from "@mui/material";
import { useThemeMode } from "../../app/theme/ThemeModeProvider";
import { useLocale, uiMessages } from "../../features/i18n";

export const ThemeModeToggle = ({
  dark = false,
  sx,
}: {
  dark?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const { mode, setMode } = useThemeMode();
  const { t } = useLocale();

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      aria-label="theme mode toggle"
      sx={{
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        borderColor: dark ? "rgba(255,255,255,0.12)" : undefined,
        ...sx,
      }}
    >
      <Button
        variant={mode === "light" ? "contained" : "outlined"}
        onClick={() => setMode("light")}
        sx={
          dark
            ? {
                color: mode === "light" ? "#101010" : "rgba(255,255,255,0.86)",
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: mode === "light" ? "#f4efe5" : "transparent",
              }
            : undefined
        }
      >
        {t(uiMessages.lightMode)}
      </Button>
      <Button
        variant={mode === "dark" ? "contained" : "outlined"}
        onClick={() => setMode("dark")}
        sx={
          dark
            ? {
                color: mode === "dark" ? "#101010" : "rgba(255,255,255,0.86)",
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: mode === "dark" ? "#12d978" : "transparent",
              }
            : undefined
        }
      >
        {t(uiMessages.darkMode)}
      </Button>
    </ButtonGroup>
  );
};
