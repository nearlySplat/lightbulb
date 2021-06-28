/**
 * @todo Fix textedit command
 * @body This command does not work currently.
 */
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
import { CommandExecute, CommandMetadata, Context } from '../types';
type ArgType = 'action' | 'type' | 'text';
export const execute: CommandExecute<ArgType> = ({ message, args }) => {
  switch (args.data.action) {
    case 'b64':
    case 'base64':
      return base64({ message, args } as Context);
    case 'uri':
    case 'url':
      return uri({ message, args } as Context);
    case 'binary':
      return binary({ message, args } as Context);
  }
  return true;
};

const base64: CommandExecute<ArgType> = ({ message, args }) => {
  const data = Buffer.from(
    args.data.text,
    args.data.action == 'decode' ? 'base64' : undefined
  ).toString(args.data.action == 'decode' ? 'ascii' : 'base64');
  const _ = new MessageEmbed()
    .setAuthor(
      `${args.data.action === 'decode' ? 'Decoded' : 'Encoded'} Base64 Text`
    )
    .setColor(CLIENT_COLOUR)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    )
    .setDescription(data)
    .setThumbnail(message.client.user?.avatarURL() as string)
    .setTimestamp();
  message.reply({
    embeds: [_],
  });
  return true;
};

const uri: CommandExecute = ({ message, args }) => {
  const data =
    args.data.action == 'encode'
      ? encodeURIComponent(args.data.text)
      : decodeURIComponent(args.data.text);
  const _ = new MessageEmbed()
    .setAuthor(
      `${args.data.action == 'decode' ? 'Decoded' : 'Encoded'} URI Component`
    )
    .setColor(CLIENT_COLOUR)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    )
    .setDescription(data)
    .setThumbnail(message.client.user?.avatarURL() as string)
    .setTimestamp();
  message.reply({
    embeds: [_],
  });
  return true;
};

const binary: CommandExecute<ArgType> = ({ message, args }) => {
  const data =
    args.data.action == 'encode'
      ? args.data.text
          .split('')
          .map(v => v.charCodeAt(0).toString(2))
          .join(' ')
      : args.data.text
          .split(' ')
          .map(v => String.fromCharCode(parseInt(v, 2)))
          .join('');
  const _ = new MessageEmbed()
    .setAuthor(
      `${args.data.action == 'decode' ? 'Decoded' : 'Encoded'} Binary Text`
    )
    .setColor(CLIENT_COLOUR)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    )
    .setDescription(data)
    .setThumbnail(message.client.user?.avatarURL() as string)
    .setTimestamp();
  message.reply({
    embeds: [_],
  });
  return true;
};

export const meta: CommandMetadata = {
  name: 'textedit',
  description: 'Encode and decode URI and base64 strings.',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'type',
      type: 'string',
      options: ['b64', 'base64', 'binary', 'uri', 'url'],
    },
    {
      name: 'action',
      type: 'string',
      options: ['encode', 'decode'],
    },
    {
      name: 'text',
      type: 'string',
    },
  ],
};
