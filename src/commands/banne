import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context, CommandMetadata } from '../types';
export const execute = ({ message, args }: Context): boolean | Promise<boolean> => {
  if (!args[0]) return message.reply("Who am I going to ~~call~~ banne? ~~Ghostbusters!~~ Nobody!").then(() => false);
  const target = message.guild.members.cache.find(v => v.name.toLowerCase() == args.join(" ").toLowerCase() || v.id == args[0] || v.tag.toLowerCase() === args.join(" ").toLowerCase()) ?? message.member;
  message.reply(`***🔨 Successfully bent ${target.user.id}***`)
  return true;
};

export const meta: CommandMetadata = {
  name: 'banne',
  description: 'Banne a member!',
  accessLevel: 0,
  aliases: [],
  hidden: true
};
