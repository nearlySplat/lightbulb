import { CommandExecute, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
import { getMember } from "../util";

export const execute: CommandExecute = ({ message, locale, commandName, args }) => {
  if (!args.length && commandName === "whatgenderami") return message.channel.send(interpolate(get("WHATGENDERAMI_TEXT", locale), { gender: get('WHATGENDERAMI', locale) })).then(() => true);
  if (!args.length) return message.channel.send(get("WHATGENDERAMI_USE_I", locale)).then(() => false);
  else {
    const user = getMember(message.guild, args.join(" "))?.user ?? args.join(" ");
    // @ts-ignore
    const target = (user.tag ?? args.join(" "))?.replace(/^[^#]+/g, v => `**${v}**`);
    message.channel.send(interpolate(get("WHATGENDERARETHEY", locale), { gender: get("WHATGENDERAMI"), target }))
    return true;
  }
  
};

export const meta: CommandMetadata = {
  name: 'whatgenderami',
  description: 'what is your true gender',
  accessLevel: 0,
  aliases: ["whatgenderis"],
};
