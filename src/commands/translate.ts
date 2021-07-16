/**
 * @todo Find free translate API
 */
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
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import {
  CommandExecute,
  CommandMetadata,
  ExtendedMessageOptions,
} from '../types';

export const meta: CommandMetadata = {
  name: 'translate',
  description:
    'Translate text from one language to another. You can reply to a message for it to be translated, too!',
  aliases: [],
  accessLevel: 0,
  params: [
    {
      name: 'text',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};
export async function translate(text: string, tgt = 'en'): Promise<string> {
  const res = await fetch('https://translate.mentality.rip/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: tgt,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  return (await res.json()).translatedText;
}
export async function translateEmbed(
  embed: MessageEmbed
): Promise<MessageEmbed> {
  return new MessageEmbed()
    .setAuthor(
      embed.author?.name ? await translate(embed.author?.name) : null,
      embed.author?.iconURL,
      embed.author?.url
    )
    .setColor(embed.color)
    .setDescription(
      embed.description ? await translate(embed.description) : null
    )
    .setFooter(
      embed.footer?.text ? await translate(embed.footer?.text) : null,
      embed.footer?.iconURL
    )
    .setImage(embed.image?.url)
    .setThumbnail(embed.thumbnail?.url)
    .setURL(embed.url)
    .addFields(
      await Promise.all(
        embed.fields.map(async v => ({
          inline: v.inline,
          value: await translate(v.value),
          name: await translate(v.name),
        }))
      )
    )
    .setTimestamp(embed.timestamp);
}
export const execute: CommandExecute<'text'> = async ctx => {
  const { text } = ctx.args.data;
  let target: string | Message = text;
  const result: ExtendedMessageOptions = {};
  if (!text) {
    if (!ctx.message.reference) {
      return [
        {
          content: ctx.t('translate.no_text'),
        },
        null,
      ];
    }
    target = await ctx.message.channel.messages.fetch(
      ctx.message.reference.messageId
    );
  }
  if (typeof target === 'string') result.content = await translate(target);
  else if (target instanceof Message) {
    if (target.embeds.length)
      result.embed = await translateEmbed(target.embeds[0]);
    if (target.content)
      result.content = `>>> ${await translate(target.content)}`;
  }
  return [result, null];
};
