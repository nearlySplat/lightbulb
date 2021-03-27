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
    embed: _,
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
    allowedMentions: {
      repliedUser: false,
      parse: [],
    },
    embed: _,
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
    embed: _,
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
