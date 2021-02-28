import {
  Collection,
  Message,
  MessageEmbed,
  NewsChannel,
  Permissions,
  Snowflake,
  TextChannel,
} from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import { get } from "../util/i18n";
export const meta: CommandMetadata = {
  accessLevel: 2,
  aliases: ['clear', 'prune'],
  description: 'Clear messages from a chat. Run `purge help` for help.',
  name: 'purge',
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
};

export const execute: CommandExecute = async ctx => {
  let msgs: MsgsCollectionType = [ctx.message] as MsgsCollectionType;

  msgs = (ctx.args[0] === 'help'
    ? []
    : await ctx.message.channel.messages.fetch({})) as MsgsCollectionType;
  switch (ctx.args[0]) {
    case 'help':
      const _ = new MessageEmbed()
        .setAuthor(get("PURGE_HELP_HEADER"))
        .setDescription(
          get("PURGE_HELP_BODY")
        )
        .setColor(CLIENT_COLOUR)
        .setThumbnail(ctx.client.user?.avatarURL() as string);
      ctx.message.channel.send(_);
      return true;
    case 'bots':
      if (ctx.message.channel.type == 'dm') return false;
      else
        ctx.message.channel = ctx.message.channel as TextChannel | NewsChannel;
      msgs = msgs
        .filter(
          (v: Message) =>
            v.author.bot &&
            Date.now() - v.createdTimestamp <= 1000 * 60 * 60 * 24 * 14
        )
        .sort(
          (prev: Message, curr: Message) =>
            prev.createdTimestamp - curr.createdTimestamp
        ) as MsgsCollectionType;
      if (!msgs.array)
        msgs.array = function (): Message[] {
          return this as Message[];
        };
      if (ctx.args[1])
        msgs = msgs
          .array()
          .reverse()
          .slice(0, parseInt(ctx.args[1])) as MsgsCollectionType;

      await ctx.message.delete();
      ctx.message.channel.bulkDelete(msgs);
      return true;
    case 'regexp':
      if (ctx.message.channel.type == 'dm' || !ctx.args[1]) return false;
      else
        ctx.message.channel = ctx.message.channel as TextChannel | NewsChannel;
      msgs = msgs
        .filter(
          v =>
            new RegExp(ctx.args.slice(1).join(' '), 'g').test(v.content) &&
            Date.now() - v.createdTimestamp <= 1000 * 60 * 60 * 24 * 14
        )
        .sort(
          (prev, curr) => prev.createdTimestamp - curr.createdTimestamp
        ) as MsgsCollectionType;
      await ctx.message.delete();
      ctx.message.channel.bulkDelete(msgs)
      return true;
    default:
      if (ctx.message.channel.type === 'dm') return false;
      if (!isNaN(parseInt(ctx.args[0]))) {
        const amount = parseInt(ctx.args[0]);
        await ctx.message.delete();
        return ctx.message.channel.bulkDelete(amount).then(() => true);
      } else return false;
  }
};

type MsgsCollectionType = (Collection<string, Message> | Message[]) & {
  filter(
    fn: (
      value: Message,
      index: number | string,
      array: Collection<Snowflake, Message> | Message[]
    ) => boolean
  ): MsgsCollectionType;
  array(): Message[];
};
