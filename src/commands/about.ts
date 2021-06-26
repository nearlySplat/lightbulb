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
import { Context, CommandMetadata, CommandExecute, CommandResponse } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute: CommandExecute = ({ message, locale }) => [
  {
    embed: new MessageEmbed()

      .setDescription(get('ABOUT_LONG_DESCRIPTION', locale))
      .setColor(CLIENT_COLOUR)
      .setAuthor(get('ABOUT_HEADER', locale))
      .setFooter(
        interpolate(get('GENERIC_REQUESTED_BY', locale), {
          requester: `${message.author.tag} (${message.author.id})`,
        }),
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string),
  },
  null,
]

export const meta: CommandMetadata = {
  name: 'about',
  description: 'Information about me!',
  accessLevel: 0,
  aliases: [],
};
