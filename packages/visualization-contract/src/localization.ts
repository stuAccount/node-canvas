export type Locale = "en" | "zh";

export type LocalizedText =
  | string
  | {
      en: string;
      zh?: string;
    };

export const DEFAULT_LOCALE: Locale = "en";

export const resolveLocalizedText = (
  value: LocalizedText,
  locale: Locale,
): string => {
  if (typeof value === "string") {
    return value;
  }

  if (locale === "zh" && value.zh) {
    return value.zh;
  }

  return value.en;
};

