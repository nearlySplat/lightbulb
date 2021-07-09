/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Snowflake } from 'discord.js';
import { model, Schema } from 'mongoose';

const schemaData = {
  gid: String,
  prefixes: [
    {
      value: String,
      author: String,
    },
  ],
};

export interface IGuildConfig {
  gid: Snowflake;
  prefixes: { value: string; author: Snowflake }[];
}

const schema = new Schema(schemaData);
export const GuildConfig = model<IGuildConfig>('GuildConfig', schema);
