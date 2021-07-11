/*
 * Copyright (C) 2020 Splatterxl
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  Collection,
  Message,
  MessageEmbed,
  NewsChannel,
  Permissions,
  Snowflake,
  TextChannel,
} from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { get, interpolate } from '../util/i18n';
export const meta: CommandMetadata = {
  accessLevel: 1,
  aliases: ['clear', 'prune'],
  description: 'Clear messages from a chat. Run `purge help` for help.',
  name: 'purge',
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  params: [
    {
      name: 'criteria',
      type: 'string',
      options: ['all', 'bots', 'help'],
    },
    {
      name: 'amount',
      type: 'int',
      optional: true,
    },
  ],
};

export const execute: CommandExecute<'criteria' | 'amount'> = async ctx => {
  let msgs: MsgsCollectionType = [ctx.message] as MsgsCollectionType;

  msgs = (
    ctx.args.data.criteria === 'help'
      ? []
      : await ctx.message.channel.messages.fetch({})
  ) as MsgsCollectionType;
  switch (ctx.args.data.criteria) {
    case 'help': {
      const _ = new MessageEmbed()
        .setAuthor(get('PURGE_HELP_HEADER', ctx.locale))
        .setDescription(
          interpolate(get('PURGE_HELP_BODY', ctx.locale), {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data: ctx.args._data.arr,
          })
        )
        .setColor(ctx.message.guild.me.roles.highest.color)
        .setThumbnail(ctx.client.user?.avatarURL() as string);
      return [{ embed: _ }, null];
    }
    case 'bots':
      if (ctx.message.channel.type == 'DM') return false;
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
      if (ctx.args.data.amount)
        msgs = msgs
          .array()
          .reverse()
          .slice(0, parseInt(ctx.args.data.amount)) as MsgsCollectionType;

      await ctx.message.delete();
      ctx.message.channel.bulkDelete(msgs as Collection<Snowflake, Message>);
      return true;

    case 'all':
      if (ctx.message.channel.type === 'DM') return false;
      if (!isNaN(parseInt(ctx.args.data.amount))) {
        const amount = parseInt(ctx.args.data.amount);
        await ctx.message.delete();
        console.log(amount);
        return ctx.message.channel.bulkDelete(amount).then(() => true);
      } else return false;
  }
  return true;
};

type MsgsCollectionType = (Collection<string, Message> | Message[]) & {
  filter(
    fn: (
      value: Message,
      key: Snowflake,
      array: Collection<Snowflake, Message> | Message[]
    ) => boolean
  ): MsgsCollectionType;
  array(): Message[];
};
