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
import { CommandMetadata, CommandExecute } from '../types';
import { GuildMember, Snowflake, TextChannel } from 'discord.js';
import { createLogMessage } from '../util';
export const execute: CommandExecute = async ({ message }) => {
  const channel = message.guild.channels.cache.find(
    value =>
      ((value.name?.match(/^💡(-log(s|ging)?)?$/g) ||
        ((value as TextChannel).topic as string | undefined)?.includes(
          '--lightbulb-logs'
        )) &&
        value.type == 'text' &&
        value
          .permissionsFor(message.guild.me as GuildMember)
          ?.has('SEND_MESSAGES')) ??
      false
  ) as TextChannel;
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes('--compact'),
      victim: {
        id: '0'.repeat(19) as Snowflake,
        tag: 'Clyde#0000',
      },
      perpetrator: {
        id: '0'.repeat(17) as Snowflake,
        tag: 'Nelly#0000',
      },
      reason: `Mod log test by **${message.author.tag}**`,
      case: 0,
      action: 'Ban',
      emoji: '🔨',
    });
    channel.send(result);
  }
  return true;
};

export const meta: CommandMetadata = {
  name: 'testlogs',
  description: 'Test the modlog',
  accessLevel: 2,
  aliases: [],
  hidden: true,
};
