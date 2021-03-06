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
/**
 * @todo Replace tags.json with user content
 * @body This file and system of tags should be removed and replaced with user-created tags. Additionally, a shorter way to create commands should be added.
 *
 */
import fs from 'fs';
import path from 'path';
const rawTags = JSON.parse(
  // eslint-disable-next-line no-undef
  fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'etc', 'tags.json'),
    'utf-8'
  )
);
export const tags = new Map<string, string>(
  Object.entries(rawTags).map(v => (console.log(v), v)) as [string, string][]
);
export default tags;
