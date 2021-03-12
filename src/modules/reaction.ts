import { Client, MessageReaction, User } from 'discord.js';

export const selfStarShaming = {
  emitter: 'on',
  eventName: 'messageReactionAdd',
  execute: async (
    client: Client,
    reaction: MessageReaction,
    user: User
  ): Promise<boolean> => {
    if (reaction.message.author.id === user.id && reaction.emoji.name === '⭐')
      reaction.message.channel.send(
        `Self-star detected by ${user} (**${user.username}**#${user.discriminator}) on message \`${reaction.message.id}\``
      );
    return true;
  },
};
