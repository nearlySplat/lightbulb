import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute = ({ message }: Context): boolean => {
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        get('ABOUT_LONG_DESCRIPTION')
      )
      .setColor(CLIENT_COLOUR)
      .setAuthor(get('ABOUT_HEADER'))
      .setFooter(
        interpolate(get('GENERIC_REQUESTED_BY'), { requester: `${message.author.tag} (${message.author.id})` }),
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string)
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'about',
  description: 'Information about me!',
  accessLevel: 0,
  aliases: [],
};
