import { readdirSync } from 'fs';
import { loggr } from '../..';

export const localeList = readdirSync(__dirname).filter(
  v => !v.match(/\.[jt]s$/g)
);

const strings: { [index: string]: Record<string, string> } = {};
for (const locale of localeList) {
  (async () => {
    const data = await import(`./${locale}/strings`);
    strings[locale] = data;
  })();
}

export const get = (key: string, locale = 'en_UK'): string => {
  if (!strings[locale]) return 'Invalid locale.';
  let data: string | string[] = strings[locale][key];
  if (typeof data === 'string') return strings[locale][key];
  else if (typeof data === 'object' && Array.isArray(data)) {
    data = data as string[];
    return data[Math.floor(Math.random() * data.length)];
  } else if (!data)
    return interpolate(strings[locale].I18N_KEY_NOT_FOUND, { key, locale });
  else return data;
};

export const interpolate = (
  str: string,
  obj: Record<string, string>
): string => {
  for (const [prop, val] of Object.entries(obj)) {
    str = str.replace(new RegExp(`{{${prop}}}`, 'g'), val);
  }
  return str;
};

export const getKeys = [
  ...new Set(
    Object.values(strings)
      .map(v => Object.values(v))
      .flat()
  ),
];
