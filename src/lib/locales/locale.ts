import en from "./en.json";
import ru from "./ru.json";
import fr from "./fr.json";

export type TranslationSchema = typeof en;
export type Locale = "en" | "ru" | "fr";
export const translations: Record<Locale, TranslationSchema> = { en, ru, fr };
