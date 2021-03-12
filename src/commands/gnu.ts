import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const execute = ({ message, locale, args }: Context): boolean => {
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        interpolate(get('STALLMAN_TEXT', locale), {
          text: args.join(' ') || 'Linux',
        })
      )
      .setColor(CLIENT_COLOUR)
      .setAuthor(get('STALLMAN_HEADER', locale))
      .setFooter(
        interpolate(get('GENERIC_REQUESTED_BY', locale), {
          requester: `${message.author.tag} (${message.author.id})`,
        }),
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string)
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'gnu',
  description: 'Sends the Stallman GNU/Linux copy-pasta.',
  accessLevel: 0,
  aliases: ['stallman'],
};
