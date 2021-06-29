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
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export function loadFiles<T>(folder: string): Collection<string, T> {
  const coll = new Collection<string, T>(),
    // eslint-disable-next-line no-undef
    files = readdirSync(join(__dirname, folder))
      .filter(value => value.match(/\.[jt]s$/g))
      .map(value => value.replace(/\.[jt]s$/g, ''));
  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
    const data = require(`${folder}/${file}`);
    coll.set(file, data);
  }
  return coll;
}
