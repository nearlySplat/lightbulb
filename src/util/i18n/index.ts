/*
 * Copyright (C) 2020 Splatterxl
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { readdirSync } from 'fs';

// eslint-disable-next-line no-undef
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
  str: string | ((obj: Record<string, string>) => string),
  obj: Record<string, string>
): string => {
  if (typeof str === 'function') return str(obj);
  else
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
