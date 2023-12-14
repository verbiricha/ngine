import en from "./translations/en.json";
import es from "./translations/es.json";

export function getMessages(locale?: string) {
  if (!locale) {
    return en;
  }

  if (locale.startsWith("es")) {
    return es;
  }

  return en;
}
