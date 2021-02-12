import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { Context } from '../types';
export const execute = ({ message }: Context): boolean => {
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        `👋 Hi! I'm 🤖💡, here to make your logging life easier!

    **My features**:
    - Logging
    - Logging
    - Logging

    Aaand... that's about it! All you need to set me up is a channel called \`💡\`! Actually, the real RegExp for that is \`/^💡(-log(s|ging)?)?$/g\`, but we won't get into that stuff.

    **What I log:**
    - 🔨 Bans
    - 🔧 Unbans
    - 👢 Kicks (Coming Soon)`.replace(/\n +/g, '\n')
      )
      .setColor(CLIENT_COLOUR)
      .setAuthor('About Me')
      .setFooter(
        `Requested by ${message.author.tag} (${message.author.id})`,
        message.author.avatarURL() as string
      )
      .setTimestamp()
      .setThumbnail(message.client.user?.avatarURL() as string)
  );
  return true;
};
