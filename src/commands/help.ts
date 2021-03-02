import { Collection, GuildMember, MessageEmbed, ClientUser } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';
import { get } from '../util/i18n';

export const execute: CommandExecute = ({ message, commands }) => {
  message.channel.send(get("HELP_ARRIVED"))
  return true;
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
};
