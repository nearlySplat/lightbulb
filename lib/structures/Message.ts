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
 import { Message as DJSMessage, MessageOptions } from 'discord.js';
import { ExtendedMessageOptions } from '../../src/types.js';
import { Candle } from './Client.js';

export class Message extends DJSMessage {
  declare client: Candle;
  async reply(options: ExtendedMessageOptions): Promise<Message> {
    if (options.embeds || options.embed) {
      options.embeds = [options.embed];
    }
    if (options.code) {
      options.content = `\`\`\`${options.code === true ? '' : options.code}\n${
        options.content
      }\n\`\`\``;
    }
    return <Promise<Message>>super.reply(<MessageOptions>options);
  }
}
