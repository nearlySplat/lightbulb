import { Collection, GuildMember, MessageEmbed, ClientUser } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';
import { get } from '../util/i18n';

export const execute: CommandExecute = ({
  message,
  locale,
  commands,
  args,
}) => {
  if (!args[0])
    message.channel.send(
      commands
        .filter(
          v =>
            getCurrentLevel(message.member as GuildMember) >=
            getAccessLevel(v.meta.accessLevel)
        )
        .map(({ meta: { name, description } }) => name + ' - ' + description), { code: 'md' }
    );
  else message.channel.send('Use `help` for specific command information');
  return true;
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
};
