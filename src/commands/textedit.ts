import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';

const invalidArg = (arg: string) => `__**Invalid Arguments!**__\n An argument for \`${arg}\` was \n- not specified or \n- not of the correct type.\n\nArguments for this command are: \`\`\`\n<type>: "base64" | "uri" | "url" | "b64" = What kind of encoding you want\n<action>: "encode" | "decode" = what you want me to do with your string\n<string>: string = the data you want me to encode/decode.\`\`\``
export const execute: CommandExecute = ({ message, args }) => {
  if (!["base64","uri","url","b64"].includes(args[0])) return message.reply(invalidArg("type")).then(v => false);
  switch (args[0]) {
    case "b64":
    case "base64":
      return base64({ message, args: args.slice(1) });
      break;
    case "uri":
    case "url":
      return uri({ message, args: args.slice(1) });
      break;
  }
};

const base64: CommandExecute = ({ message, args }) => {
  if (!args[0] || !["encode","decode"].includes(args[0])) return message.reply(invalidArg("action")).then(() => false);
  if (!args[1]) return message.reply(invalidArg("data")).then(() => false);
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

const uri: CommandExecute = ({ message, args }) => {
  if (!args[0] || !["encode","decode"].includes(args[0])) return message.reply(invalidArg("action")).then(() => false);
  if (!args[1]) return message.reply(invalidArg("data")).then(() => false);
  const data = args[0] == "encode" ? encodeURIComponent(args.slice(1).join(" ")) : decodeURIComponent(args.slice(1).join(" "))
  const _ = new MessageEmbed()
    .setAuthor(`${args[0] == "decode" ? "Decoded" : "Encoded"} URI Component`)
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
  name: 'textedit',
  description: 'Encode and decode URI and base64 strings.',
  accessLevel: 0,
  aliases: [],
};
