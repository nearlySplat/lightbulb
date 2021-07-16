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
import { config, COMMIT } from '@lightbulb/src/constants';
import { version as DJSVersion } from 'discord.js';
import fs from 'fs';
import path from 'path';
const pkg = JSON.parse(
  fs.readFileSync(path.resolve('./package.json'), 'utf-8')
);

export class Manager {
  get userAgent(): string {
    return `${config.bot.name}/${pkg.version} Discordbot (Discord.js/${DJSVersion}, Node.js/${process.version})`;
  }

  get version(): string {
    return pkg.version;
  }

  get packageName(): string {
    return pkg.name;
  }

  get commit(): string {
    return COMMIT;
  }

  get versionSlug(): string {
    return `${this.packageName}@${this.version}-${this.commit.slice(0, 7)}`;
  }
}
