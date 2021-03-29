/*
 * Copyright (C) 2020 Splaterxl
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
import { Context, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute = ({
  message,
  args,
  locale,
}: Context): boolean | Promise<boolean> => {
  if (isNaN(parseInt(args[0], 16)))
    return message.reply('Invalid hex color.').then(() => false);
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        interpolate(get('HEX_BODY', locale), {
          hex_value: parseInt(args[0], 16).toString(16),
          decimal_value: parseInt(args[0], 16),
        })
      )
      .setColor(parseInt(args[0], 16))
      .setAuthor(
        interpolate(get('HEX_HEADER', locale), {
          color: parseInt(args[0], 16).toString(16),
        })
      )
      .setFooter(
        interpolate(get('GENERIC_REQUESTED_BY', locale), {
          requester: `${message.author.tag} (${message.author.id})`,
        }),
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string)
      .setImage(
        `https://blargbot.xyz/color/${parseInt(args[0], 16)
          .toString(16)
          .toUpperCase()}`
      )
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'hex',
  description: 'Get information about a hex color',
  accessLevel: 0,
  aliases: [],
};
