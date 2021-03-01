import { readdirSync } from 'fs';
import { loggr } from "../..";

export const localeList = readdirSync(__dirname).filter(
  v => !v.match(/\.[jt]s$/g)
);

let strings: { [index: string]: Record<string, string> } = {};
for (const locale of localeList) {
  (async () => {
    const data = await import(`./${locale}/strings`);
    strings[locale] = data;
    loggr.debug(`Loaded I18n locale ${locale}.`)
  })()
}

export const get = (key: string, locale: string = 'en_UK'): string => {
  if (!strings[locale]) return "Invalid locale.";
  return (
    strings[locale][key] ??
    interpolate(strings[locale].I18N_KEY_NOT_FOUND, { key, locale })
  );
};

export const interpolate = (str: string, obj: Record<string, any>) => {
  for (const [prop, val] of Object.entries(obj)) {
    str = str.replace(new RegExp(`{{${prop}}}`, 'g'), val);
  }
  return str;
};

export const getKeys = () => {
  const arr = [];
  for (const obj of Object.values(strings)) { 
    for (const value of Object.keys(obj)) {
      arr.push(value)
    }
  }
  return [...(new Set(arr))];
}
