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
import { TextChannel } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { createLogMessage, getLogChannel, getMember } from '../util';
import { get, interpolate } from '../util/i18n';
export const execute: CommandExecute<'user' | 'reason'> = ({
  message,
  args,
  locale,
}) => {
  const target = getMember(message.guild, args.data.user) ?? {
    user: { tag: args.data.user, id: '0' },
  };
  message.reply(
    interpolate(get('BANNE_SUCCESSFUL', locale), { target: target.user.tag })
  );
  const channel = getLogChannel(message.guild) as TextChannel;
  if (!channel) return true;
  channel.send(
    createLogMessage({
      compact: channel.topic.includes('--compact'),
      victim: target.user,
      perpetrator: message.author,
      action: 'Bend',
      context: '... wait no, `[bent]`',
      emoji: '🔨',
      case: Infinity,
      reason: args.data.reason,
    })
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'banne',
  description: 'Banne a member!',
  accessLevel: 0,
  aliases: [],
  hidden: true,
  params: [
    {
      name: 'user',
      type: 'string',
    },
    {
      name: 'reason',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};
