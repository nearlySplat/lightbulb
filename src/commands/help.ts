import { Collection, GuildMember, MessageEmbed, ClientUser } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';
import { get, interpolate } from "../util/i18n";

export const execute: CommandExecute = ({ message, commands }) => {
  const _ = new MessageEmbed()
    .setAuthor('Help')
    .setColor(CLIENT_COLOUR)
    .setFooter(
      interpolate(get("GENERIC_REQUESTED_BY"), `${message.author.tag} (${message.author.id})`),
      message.author.avatarURL() as string
    )
    .setDescription(
      (commands.filter(
        v =>
          !!v.meta &&
          getAccessLevel(v.meta.accessLevel as 0 | 1 | 2 | 3) <=
            getCurrentLevel(message.member as GuildMember) && !v.meta.hidden
      ) as Collection<
        string,
        { execute: CommandExecute; meta: CommandMetadata }
      >)
        .map(value => `**${value.meta.name}** - ${value.meta.description}`)
        .join('\n')
    )
    .setThumbnail((message.client.user as ClientUser).avatarURL() as string)
    .setTimestamp();
  message.reply({
    embed: _,
  });
  return true;
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
};
