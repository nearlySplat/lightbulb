import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context, CommandMetadata } from '../types';
import { get, interpolate } from "../util/i18n";
export const execute = ({ message, args }: Context): boolean | Promise<boolean> => {
  if (isNaN(parseInt(args[0], 16))) return message.reply("Invalid hex color.").then(() => false)
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        interpolate(get("HEX_BODY"), { hex_value: parseInt(args[0], 16).toString(16), decimal_value: parseInt(args[0], 16)})
      )
      .setColor(parseInt(args[0], 16))
      .setAuthor(interpolate(get("HEX_HEADER"), { color: parseInt(args[0], 16).toString(16) }))
      .setFooter(
        interpolate(get("GENERIC_REQUESTED_BY"), { requester: `${message.author.tag} (${message.author.id})`}),
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
