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
import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  name: 'mingpods',
  description: 'Ming a poderator',
  aliases: ['mingpod'],
  params: [{ name: 'reason', type: 'string', rest: true, optional: true }],
  accessLevel: 0,
};

export const execute: CommandExecute<'reason'> = ctx => {
  ctx.message.channel.send(
    `**Pod Automing**\n${(ctx.args.data.reason || '') + '\n'}${
      ctx.message.author
    } (By **${ctx.message.author.username}**)`.replace(/\n{2,}/g, '\n'),
    { allowedMentions: { users: [ctx.message.author.id] } }
  );
  return true;
};
