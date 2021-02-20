import { Context, CommandMetadata } from '../types';
export const execute = ({ message, args }: Context): boolean | Promise<boolean> => {
  if (!args[0]) return message.reply("Who am I going to ~~call~~ banne? ~~Ghostbusters!~~ Nobody!").then(() => false);
  const target = message.guild?.members.cache.get(args[0]?.replace(/(<@!?|>)/g, "")) ?? message.guild?.members.cache.find(v => v.user.username.toLowerCase() == args.join(" ").toLowerCase() || v.user.tag.toLowerCase() === args.join(" ").toLowerCase() || v.displayName.toLowerCase() == args.join(" ").toLowerCase()) ?? message.member;
  message.reply(`***🔨 Successfully bent ${target.user.tag}***`)
  return true;
};

export const meta: CommandMetadata = {
  name: 'banne',
  description: 'Banne a member!',
  accessLevel: 0,
  aliases: [],
  hidden: true
};
