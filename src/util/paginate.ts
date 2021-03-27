import {
  APIMessage,
  Message,
  MessageReaction,
  StringResolvable,
  TextChannel,
  User,
} from 'discord.js';
import {loggr} from '..';
import { PAGINATION_REACTIONS } from '../constants';

export const paginate = (
  pages: (StringResolvable | APIMessage)[],
  { channel, controller }: { channel: TextChannel; controller: User }
) => {
  return new Promise(async resolve => {
    let curr = 0,
      m: Message | null = await channel.send(
        pages[0] || new TypeError('No default page specified').toString()
      );
    const update = async (index: number) =>
      m?.deleted
        ? null
        : (m =
            (await m?.edit(pages[index]).catch(() => {
              void collector.stop();
              return null;
            })) ?? null);
    const handlers: Record<
      string,
      (reaction: MessageReaction, user: User) => any | void
    > = {
      '▶️': () =>
        curr >= pages.length - 1 ? (curr = pages.length - 1) : curr++,
      '◀️': () => (curr <= 0 ? (curr = 0) : curr++),
      '⬅️': () => (curr = 0),
      '➡️': () => (curr = pages.length - 1),
      '⏹': async () => {
        m = (await m?.delete()) ?? null;
        void collector.stop();
      },
    };
    curr++;
    for (const reaction of PAGINATION_REACTIONS) m.react(reaction);
    const collector = m.createReactionCollector((r, u) => {
      if (u.id === controller.id) return true;
      else if (!u.bot) {
        void r.remove().catch(() => null);
        return false;
      } else return false;
    });
    collector.on('collect', (reaction, user) => {
      loggr.debug("reaction: ", reaction.emoji.name)
      void reaction.users.remove(user.id).catch(() => null);
      if (reaction.emoji.name in handlers)
        handlers[reaction.emoji.name](reaction, user);
      else if (!user.bot) reaction.remove();
      update(curr);
    });
    collector.on('end', resolve);
  });
};
