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
import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandMetadata, CommandExecute } from '../types';
import { getMember } from '../util';

export const meta: CommandMetadata = {
  name: 'avatar',
  description: 'command name',
  aliases: ['av', 'avy'],
  accessLevel: 0,
  params: [{ name: 'user', type: 'string' }],
};

export const execute: CommandExecute = async ctx => {
  const target = getMember(ctx.message.guild, ctx.args.data.user).user;
  if (!target) return [{ content: 'No target.' }, null];
  return [
    {
      embed: new MessageEmbed()
        .setAuthor(ctx.t('avatar.title', { target }))
        .setColor(ctx.message.guild.me.roles.color.color || CLIENT_COLOUR)
        .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setTimestamp()
        .setFooter(
          ctx.t('generic_requested_by', {
            requester: `${ctx.message.author.tag} (${ctx.message.author.id})`,
          })
        ),
    },
    null,
  ];
};
