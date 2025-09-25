import en from "./en.json";
import ru from "./ru.json";
import fr from "./fr.json";

export type TranslationSchema = typeof en;
export type Locale = "en" | "ru" | "fr";
export const translations: Record<Locale, TranslationSchema> = { en, ru, fr };

export function t(
  locale: Locale,
  path: string,
  vars: Record<string, string | number> = {}
): string {
  const keys = path.split(".");
  let value: unknown = translations[locale];

  for (const key of keys) {
    if (typeof value === "object" && value !== null) {
      value = (value as Record<string, unknown>)[key];
    } else {
      throw new Error(
        `Invalid translation path: '${path}' for locale: '${locale}'`
      );
    }
  }

  if (typeof value !== "string") {
    throw new Error(`Translation key "${path}" is not a string`);
  }
  return value.replace(/\{\{(.*?)\}\}/g, (_, v) =>
    String(vars[v.trim()] ?? "")
  );
}
