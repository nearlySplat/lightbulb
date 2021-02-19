import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context, CommandMetadata } from '../types';
export const execute = ({ message, args }: Context): boolean | Promise<boolean> => {
  if (isNaN(parseInt(args[0]))) return message.reply("Invalid hex color.")
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        `**Hexadecimal Value**: #${parseInt(args[0], 16).toString(16)}
         **Decimal Value**: ${parseInt(args[0], 16)}`.replace(/\n +/g, '\n')
      )
      .setColor(parseInt(args[0], 16))
      .setAuthor(`Hexadecimal Colour #${parseInt(args[0], 16).toString(16)}`)
      .setFooter(
        `Requested by ${message.author.tag} (${message.author.id})`,
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string)
      .setImage(`https://blargbot.xyz/color/${parseInt(args[0], 16).toString(16).toUpperCase()}`)
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'hex',
  description: 'Get information about a hex color',
  accessLevel: 0,
  aliases: [],
};
