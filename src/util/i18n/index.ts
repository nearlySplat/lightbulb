import { readdirSync } from 'fs';

export const localeList = readdirSync(__dirname).filter(
  v => !v.match(/\.[jt]s$/g)
);

export const get = async (key: string, locale: string = 'en_UK'): Promise<string> => {
  try {
    const strings = await import(`./${locale}/strings.ts`);
  } catch {
    return 'Invalid locale.'
  }
  return (
    strings[key] ??
    strings.I18N_KEY_NOT_FOUND
  );
};

export const interlop = (str: string, obj: Record<string, any>) => {
  for (const [prop, val] of Object.entries(obj)) {
    str = str.replace(new RegExp(`{{${prop}}}`, 'g'), val);
  }
  return str;
};
