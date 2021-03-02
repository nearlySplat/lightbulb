import { Collection, GuildMember, MessageEmbed, ClientUser } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';
import { get } from '../util/i18n';

export const execute: CommandExecute = ({ message, locale, commands, args }) => {
  if (!args[0]) message.channel.send(get("HELP_ARRIVED", locale));
  else message.channel.send(get(`${commands.has(args[0]) ? (commands.get(args[0])?.meta.name.toUpperCase() + "_DESCRIPTION") : "HELP_ARRIVED"}`, locale))
  return true;
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
};
