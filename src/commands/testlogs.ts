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
import { createLogMessage, getLogChannel } from '../util';
export const execute: CommandExecute = async ({ message, locale }) => {
  const channel = getLogChannel(message.guild);
  if (channel) {
    const result = createLogMessage({
      compact: channel.topic?.includes('--compact'),
      victim: message.author,
      perpetrator: {
        id: '0'.repeat(18) as Snowflake,
        tag: 'Nelly#0000',
      },
      reason: message.client.i18n.get('moderation.no_reason', locale),
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
