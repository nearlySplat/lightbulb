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
  Message,
  MessageEmbed,
  MessageFlags,
  NewsChannel,
  TextChannel,
  Util,
} from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { i18n } from '../util';

export const meta: CommandMetadata = {
  name: 'message',
  description: 'Gets info about a specific message in a channel.',
  params: [
    {
      name: 'messageid',
      type: 'string',
      optional: true,
    },
    {
      name: 'channelid',
      type: 'string',
      optional: true,
    },
  ],
  aliases: ['messageinfo', 'mi'],
  accessLevel: 'USER',
};

const keywords = {
    first: async (_: Message, c: TextChannel) =>
      await c.messages
        .fetch({
          limit: 1,
          after: '1',
        })
        .then(v => v.first()),
    latest: async (_: Message, c: TextChannel) =>
      await c.messages
        .fetch({
          limit: 2,
        })
        .then(v => v.last()),
    this: (m: Message) => m,
  },
  handleKeyword = (word: keyof typeof keywords, m: Message, c: TextChannel) =>
    keywords[word](m, c);

export const execute: CommandExecute<'messageid' | 'channelid'> = async ({
  message,
  args,
  locale,
}) => {
  let channel = message.guild.channels.cache.get(
    args.data.channelid?.replace(/(^<#|>$)/g, '') || message.channel.id
  ) as TextChannel;
  if (!channel || ![NewsChannel, TextChannel].some(v => channel instanceof v)) {
    message.channel.send(i18n.get('MESSAGEINFO_CHANNEL_NOT_FOUND', locale));
    return false;
  }
  let target: Message;
  try {
    target = (await (args.data.messageid in keywords
      ? handleKeyword(
          args.data.messageid as keyof typeof keywords,
          message,
          channel
        )
      : channel.messages.fetch(args.data.messageid || message.id))) as Message;
  } catch {
    message.channel.send(i18n.get('MESSAGEINFO_MESSAGE_NOT_FOUND', locale));
    return false;
  }
  const text = `**__ID__**: ${target.id}
            **__Flags__**: ${target.flags.toArray().join(', ') || 'None'}
           **__Author__**: ${target.author.tag} (${target.author.id})
          **__Channel__**: #${(target.channel as TextChannel).name} (${
    target.channel.id
  })
          **__Content__**: ${
            target.content !== ''
              ? `
 > ${target.content.replace(/\n/g, '\n > ')}`
              : 'None'
          }
           **__Pinned__**: ${target.pinned}
**__Embeds Suppressed__**: ${target.flags.has(
    MessageFlags.FLAGS.SUPPRESS_EMBEDS
  )}
           **__Embeds__**: ${target.embeds.length}
       **__Created At__**: ${target.createdAt.toLocaleString()} (UNIX time: ${
    target.createdTimestamp
  })
        **__Reactions__**: ${
          target.reactions.cache
            .map(v => `${v.emoji.toString()} (${v.count})`)
            .join(' | ') || 'None'
        }
             **__Link__**: [Jump!](${target.url})`
    .replace(/\n */g, '\n')
    .replace(/(__)?\*\*(__)?/g, '**');
  return [
    {
      embed: new MessageEmbed({
        author: {
          name: `${target.author.tag} (${target.author.id})`,
          iconURL: target.author.avatarURL() || target.author.defaultAvatarURL,
          url: message.url,
        },
        color: message.guild.me!.roles.highest.color,
        description: text,
        footer: {
          text: i18n.interpolate(i18n.get('GENERIC_REQUESTED_BY', locale), {
            requester: `${message.author.tag} (${message.author.id})`,
          }),
          iconURL: message.author.avatarURL() as string,
        },
        timestamp: Date.now(),
      }),
    },
    null,
  ];
};
