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
import { CommandMetadata, CommandExecute } from '../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const execute: CommandExecute = ({ message, args, t }) => {
  if (isNaN(parseInt(args[0], 16)))
    return [{ content: t('hex.invalid') }, null] as const;
  return [
    {
      embed: new MessageEmbed()
        .setDescription(
          t('hex.body', {
            hex_value: parseInt(args[0], 16).toString(16),
            decimal_value: parseInt(args[0], 16).toString(),
          })
        )
        .setColor(parseInt(args[0], 16))
        .setAuthor(
          t('hex.header', {
            color: parseInt(args[0], 16).toString(16),
          })
        )
        .setFooter(
          t('generic.requested_by', {
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
        ),
    },
    null,
  ] as const;
};

export const meta: CommandMetadata = {
  name: 'hex',
  description: 'Get information about a hex color',
  accessLevel: 0,
  aliases: [],
};
