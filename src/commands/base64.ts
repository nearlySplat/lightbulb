import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';

const invalidArg = arg => `__**Invalid Arguments!**__\n An argument for \`${arg}\` was \n- not specified or \n- not of the correct type.\n\nArguments for this command are: \`\`\`\n<action>: "encode" | "decode" = what you want me to do with your string\n<string>: string = the data you want me to encode/decode.\`\`\``
export const execute: CommandExecute = ({ message, args }) => {
  if (!args[0] || !["encode","decode"].includes(args[0])) return message.reply(invalidArg("action"));
  if (!args[1]) return message.reply(invalidArg("data"));
  const data = Buffer.from(args.slice(1).join(" "), args[0] == "decode" ? "base64" : undefined).toString(args[0] == "decode" ? "ascii" : "base64")
  const _ = new MessageEmbed()
    .setAuthor(`${args[0] == "decode" ? "Decoded" : "Encoded"} Base64 Text`)
    .setColor(CLIENT_COLOUR)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    )
    .setDescription(
      data
    )
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

export const meta: CommandMetadata = {
  name: 'base64',
  description: 'Encode and decode base64 strings.',
  accessLevel: 0,
  aliases: [],
};
