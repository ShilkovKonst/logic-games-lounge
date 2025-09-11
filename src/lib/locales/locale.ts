import en from "./en.json";
import ru from "./ru.json";
import fr from "./fr.json";

export type TranslationSchema = typeof en;
export type Locale = "en" | "ru" | "fr";
export type Path<T, Prev extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prev}${K}` // ex "modal.reset.title"
    : T[K] extends object
    ?
        | `${Prev}${K}` // ex "modal.reset"
        | Path<T[K], `${Prev}${K}.`> // ex "modal.reset.title"
    : never;
}[keyof T & string];

export const translations: Record<Locale, TranslationSchema> = { en, ru, fr };
