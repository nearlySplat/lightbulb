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
  ChannelLogsQueryOptions,
  Client,
  Collection,
  Message,
  MessageFlags,
  Team,
  Util,
} from 'discord.js';
import { PREFIXES } from '../constants';
import fs from 'graceful-fs';
import path from 'path';
import { EOL } from 'os';
import { Markov } from '../util/markov';
let markov = fs
  .readFileSync(path.join(__dirname, '..', '..', 'etc', 'markov.txt'), 'utf-8')
  .split(EOL);
const instance = new Markov(markov);
export const splatMarkov = {
  emitter: 'on',
  eventName: 'message',
  guildablePath: 'params[0].guild.id',
  restricted: false,
  execute: async (client: Client, message: Message): Promise<boolean> => {
    const INVALID = (t: string) =>
      [
        ...PREFIXES,
        client.user.toString(),
        'eureka',
        ...'+×÷=/_@#$%^&*()-:;!?,.',
      ].some(v => t.startsWith(v));
    if (
      !message.content.match(/^splat ?pls/) &&
      message.author.id !== '728342296696979526'
    )
      return false;
    else if (
      !message.content.match(/^splat ?pls/) &&
      message.author.id === '728342296696979526'
    ) {
      if (INVALID(message.content)) return false;
      markov.push(message.cleanContent);
      fs.writeFileSync(
        path.join(__dirname, '..', '..', 'etc', 'markov.txt'),
        markov.join(EOL)
      );
      instance.seed(markov);
      return true;
    }
    const args = message.content.replace(/^splat ?pls ?/g, '').split(/\s+/);
    if (args[0] === 'analyze') {
      const results = instance.analyze();
      const longerThan5 = instance.sentences.filter(
        value => value.split('\\s+').length >= 5
      ).length;
      return message.channel
        .send(
          (results.all.unique.size >= 50
            ? "Hmmm... splat has an extensive vocabulary. I'll do my best to analyze it!"
            : "I've successfully analyzed splat's markov.") +
            `\n\nThere are \`${
              instance.sentences.length
            }\` sentences available for me to analyze, \`${longerThan5}\` of which are more than 5 words long (${(
              (longerThan5 / instance.sentences.length) *
              100
            ).toFixed(2)}%).` +
            `\n\nI have a repotoire of ${
              results.starts.unique.size
            } words to start a sentence with, the top being ${Object.entries(
              results.starts.top
            )
              .slice(0, 3)
              .map(([K, V]) => `${K} (\`${V}\` times)`)
              .join(', ')}.`
        )
        .then(() => true);
    } else if (args[0] === 'count')
      return message.channel
        .send(instance.sentences.length + ' sentences collected')
        .then(() => true);
    else if (args[0] === 'load') {
      if (!message.client.application.owner)
        message.client.application = await message.client.application.fetch();
      if (
        message.author.id !== message.client.application.owner.id &&
        !(message.client.application.owner as Team).members.has(
          message.author.id
        )
      )
        return message.channel
          .send('You are not authorized to do this.')
          .then(() => true);
      const msgs = await message.channel.messages
        .fetch(
          (args[1]
            ? args[1]
            : {
                limit: 100,
              }) as ChannelLogsQueryOptions,
          true,
          true
        )
        .then((t: Collection<string, Message> | Message) =>
          t instanceof Collection
            ? t.filter(
                v => v.author.id === message.author.id && !INVALID(v.content)
              )
            : !INVALID(t.content)
        );
      markov.push(
        ...((msgs instanceof Collection ? msgs : [msgs]).map as (
          fn: (m: Message) => string
        ) => string[])(v => v.cleanContent)
      );
      fs.writeFileSync(
        path.join(__dirname, '..', '..', 'etc', 'markov.txt'),
        markov.join(EOL)
      );
      instance.seed(markov);
      message.channel.send(
        `Successfully loaded ${
          msgs instanceof Collection ? msgs.size : 1
        } message(s)`
      );
      return true;
    }
    message.channel.startTyping();
    console.log('started generating sentence');
    const text = args[0]
      ? instance.generate(0, { hasToHave: args[0] })
      : instance.generate();
    console.log(text);
    message.channel
      .send(
        text !== 'NONE_FOUND_ENONEFOUND'
          ? `Well, splat once said...\n> <:splat:826153213321412618> **Splatterxl#8999**\n> ${text}`
          : "I couldn't make a sentence for that word..."
      )
      .then(t =>
        t.edit({
          flags: MessageFlags.FLAGS.SUPPRESS_EMBEDS,
        })
      );
    message.channel.stopTyping(true);
    return true;
  },
};
