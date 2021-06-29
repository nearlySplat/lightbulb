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
 */import { User } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types.js';
import { AccessLevels } from '../util/getAccessLevel.js';
import { getMember } from '../util';
import { statusEmojis } from './user.js';

export const meta: CommandMetadata = {
  name: 'presence',
  description: 'Shows the presence of a user',
  aliases: ['status'],
  params: [
    {
      name: 'user',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
  accessLevel: AccessLevels.USER,
};

export const execute: CommandExecute = ctx => {
  let target: User;
  if (!ctx.args.data.user) {
    target = ctx.message.author;
  } else {
    target = getMember(ctx.message.guild, ctx.args.data.user).user;
  }
  if (!target) return [{ content: 'No user found.' }, null];
  if (!target.presence.clientStatus) return [{ content: 'No data.' }, null];
  const status = target.presence.clientStatus;
  return [
    {
      content: `**__${target.tag}'s Presence__**\n\n${
        status.desktop
          ? `**Desktop**: <:${statusEmojis[status.desktop]}>\n`
          : ''
      }${status.web ? `**Web**: <:${statusEmojis[status.web]}>\n` : ''}${
        status.mobile
          ? `**Mobile** <:${statusEmojis.mobile}>: <:${
              statusEmojis[status.desktop]
            }>\n`
          : ''
      }`,
    },
    null,
  ];
};
