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
import { GuildMember } from 'discord.js';
import { CommandMetadata, CommandExecute } from '../types';
import { getMember } from '../util';
import { get, interpolate } from '../util/i18n';
export const execute: CommandExecute<'user'> = ({ message, args, locale }) => {
  if (!args[0])
    return message.reply(get('BEAN_NO_TARGET', locale)).then(() => false);
  const target =
    getMember(message.guild, args.data.user) ??
    ({ user: { tag: args.data.user } } as GuildMember);
  return [{content:
    interpolate(get('BEAN_SUCCESSFUL', locale), { target: target.user.tag })
  }, null]
  return true;
};

export const meta: CommandMetadata = {
  name: 'bean',
  description: '<:bean:813134247505559572>',
  accessLevel: 0,
  aliases: [],
  hidden: true,
  params: [
    {
      name: 'user',
      type: 'string',
      rest: true,
    },
  ],
};
