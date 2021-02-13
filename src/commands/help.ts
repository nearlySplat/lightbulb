import { Collection, GuildMember, MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';

export const execute: CommandExecute = ({ message, commands }) => {
  const _ = new MessageEmbed()
    .setAuthor('Help')
    .setColor(CLIENT_COLOUR)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id}) | Please note that I do not respond to commands prefixed with ! other than 'reason'`,
      message.author.avatarURL() as string
    )
    .setDescription(
      (commands.filter(
        v =>
          !!v.meta &&
          getAccessLevel(v.meta.accessLevel as 0 | 1 | 2 | 3) <=
            getCurrentLevel(message.member as GuildMember)
      ) as Collection<
        string,
        { execute: CommandExecute; meta: CommandMetadata }
      >)
        .map(value => `**${value.meta.name}** - ${value.meta.description}`)
        .join('\n')
    );
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
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 3,
  aliases: [],
};
