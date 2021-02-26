import { readdirSync } from 'fs';
import * as en_UK_STRINGS from './en_UK/strings';

export const strings: Record<
  string,
  Record<string, string | undefined> | undefined
> = {
  en_UK: en_UK_STRINGS,
};

export const localeList = readdirSync(__dirname).filter(
  v => !v.match(/\.[jt]s$/g)
);

export const get = (key: string, locale: string = 'en_UK'): string => {
  return (
    strings[locale][key] ??
    `This I18n string has not been localised into ${locale} yet.`
  );
};

export const interlop = (str: string, obj: Record<string, any>) => {
  for (const [prop, val] of Object.entries(obj)) {
    str = str.replace(new RegExp(`{{${prop}}}`, 'g'), val);
  }
  return str;
};
