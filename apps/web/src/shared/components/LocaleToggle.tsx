import { Button, ButtonGroup, type SxProps, type Theme } from "@mui/material";
import { useLocale } from "../../features/i18n";

export const LocaleToggle = ({
  dark = false,
  sx,
}: {
  dark?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const { locale, setLocale } = useLocale();

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      aria-label="language toggle"
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
        variant={locale === "en" ? "contained" : "outlined"}
        onClick={() => setLocale("en")}
        sx={
          dark
            ? {
                color: locale === "en" ? "#101010" : "rgba(255,255,255,0.86)",
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: locale === "en" ? "#12d978" : "transparent",
              }
            : undefined
        }
      >
        EN
      </Button>
      <Button
        variant={locale === "zh" ? "contained" : "outlined"}
        onClick={() => setLocale("zh")}
        sx={
          dark
            ? {
                color: locale === "zh" ? "#101010" : "rgba(255,255,255,0.86)",
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: locale === "zh" ? "#12d978" : "transparent",
              }
            : undefined
        }
      >
        中文
      </Button>
    </ButtonGroup>
  );
};
