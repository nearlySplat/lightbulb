import {
  Collection,
  Message,
  MessageEmbed,
  NewsChannel,
  Permissions,
  TextChannel,
} from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  accessLevel: 2,
  aliases: ['clear', 'prune'],
  description: 'Clear messages from a chat. Run `purge help` for help.',
  name: 'purge',
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
};

export const execute: CommandExecute = async ctx => {
  let msgs:
        | Collection<string, Message>
        | Message[]
        | undefined
  if (ctx.args[0] !== "help") msgs = await ctx.message.channel.messages.fetch({})
  switch (ctx.args[0]) {
    default:
    case 'help':
      const _ = new MessageEmbed()
        .setAuthor('Purge Help')
        .setDescription(
          `There are many features in this command.
        - \`purge bots\`: deletes the last 100 messages that are by bots and are under 14 days old.
        `.replace(/\n +/g, '\n')
        )
        .setColor(CLIENT_COLOUR)
        .setThumbnail(ctx.client.user?.avatarURL() as string);
      ctx.message.channel.send(_);
      return true;
    case 'bots':
      if (ctx.message.channel.type == 'dm') return;
      else
        ctx.message.channel = ctx.message.channel as TextChannel | NewsChannel;
      msgs = msgs
        .filter(
          v =>
            v.author.bot &&
            Date.now() - v.createdTimestamp <= 1000 * 60 * 60 * 24 * 14
        )
        .sort((prev, curr) => prev.createdTimestamp - curr.createdTimestamp);
      if (ctx.args[1])
        msgs = msgs
          .array()
          .reverse()
          .slice(0, parseInt(ctx.args[1]));
      await ctx.message.delete();
      ctx.message.channel.bulkDelete(msgs).then(values => {
        ctx.message.reply(
          `<:goodboi:804856531082412042> Deleted ${values.size || 1} message(s).`
        ).then(v => setTimeout(() => v.delete(), 3000));
      });
      return true;
    case 'regexp':
      if (ctx.message.channel.type == 'dm' || !ctx.args[1]) return;
      else
        ctx.message.channel = ctx.message.channel as TextChannel | NewsChannel;
      msgs = msgs
        .filter(
          v =>
            new RegExp(ctx.args.slice(1).join(" "), "g").test(v.content) &&
            Date.now() - v.createdTimestamp <= 1000 * 60 * 60 * 24 * 14
        )
        .sort((prev, curr) => prev.createdTimestamp - curr.createdTimestamp);
      await ctx.message.delete();
      ctx.message.channel.bulkDelete(msgs).then(values => {
        ctx.message.reply(
          `<:goodboi:804856531082412042> Deleted ${values.size || 1} message(s).`
        );
      });
      return true;
  }
};
