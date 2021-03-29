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
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { loggr } from '..';

export function loadFiles<T>(folder: string): Collection<string, T> {
  const coll = new Collection<string, T>(),
    files = readdirSync(join(__dirname, folder))
      .filter(value => value.match(/\.[jt]s$/g))
      .map(value => value.replace(/\.[jt]s$/g, ''));
  for (let file of files) {
    loggr.debug(`Loaded file ${file}.ts from ${folder}`);
    const data = require(`${folder}/${file}`);
    coll.set(file, data);
  }
  // while (!coll.array().find((_, i) => i === (files.length - 1))) {}
  loggr.debug(`Loaded ${coll.size} files.`);
  return coll;
}
