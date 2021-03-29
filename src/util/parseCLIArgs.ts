/*
 * Copyright (C) 2020 Splaterxl
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
export const parseCLIArgs = (
  argv: string,
  { switches, options }: { switches: string[]; options: string[] }
) => {
  const parsed =
    argv
      .match(/([\w\.\/]+|-(\w)|--(\w+([:= \s]+[^-]("[^"]+"|\S+))?))/g)
      ?.map(v => v.replace(/^\s?-{1,2}/g, '')) ?? [];
  const nonAccepted = parsed
    .map(v => v.match(/^\S+/g)?.[0])
    .filter(v => ![switches, options].flat().includes(v ?? ''));
  const invalid = parsed
    .filter(v => [switches, options].flat().includes(v))
    .filter(v =>
      switches.includes(v) ? !!v.match(/^\S\s/g) : !v.match(/^\S\s/g)
    );
  const parsedOptions = Object.fromEntries(
    parsed
      .filter(v => !invalid.includes(v))
      .map(
        v =>
          (switches.includes(v.match(/\S+/g)?.[0] ?? '')
            ? [v, true]
            : v.match(/("[^"]+"|\S+)/g)) ?? []
      )
  );

  return {
    parsed,
    nonAccepted,
    invalid,
    options: parsedOptions,
  };
};
