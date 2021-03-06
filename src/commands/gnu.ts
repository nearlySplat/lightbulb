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
export const execute: CommandExecute = ({ message, args, t }) => {
  return [
    {
      embed: new MessageEmbed()
        .setDescription(
          t('gnu.text', {
            text: args.join(' ') || 'Linux',
          })
        )
        .setColor(CLIENT_COLOUR)
        .setAuthor(t('gnu.header'))
        .setFooter(
          t('generic.requested_by', {
            requester: `${message.author.tag} (${message.author.id})`,
          }),
          message.author.avatarURL() as string
        )
        .setTimestamp()
        .setThumbnail(message.client.user?.avatarURL() as string),
    },
    null,
  ];
};

export const meta: CommandMetadata = {
  name: 'gnu',
  description: 'Sends the Stallman GNU/Linux copy-pasta.',
  accessLevel: 0,
  aliases: ['stallman'],
};
