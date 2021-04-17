/*
 * Copyright (C) 2020 Splaterxl
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
import { shuffle } from 'lodash';
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
    let markov = fs
      .readFileSync(
        path.join(__dirname, '..', '..', 'etc', 'markov.txt'),
        'utf-8'
      )
      .split(EOL);
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
      return true;
    }
    const words = markov.reduce((a, b) => a + ' ' + b).split(/ +/);
    const args = message.content.replace(/^splat ?pls ?/g, '').split(/\s+/);
    if (args[0] === 'analyze') {
      const upObj = (o: { [k in string]: number }) => {
        for (const word of words) o[word] = o[word] ? o[word] + 1 : 1;
        return o;
      };
      type T = Record<string, number>;
      const dict = {
        words: upObj({}),
        starts: {} as T,
        ends: {} as T,
      };
      for (const word of markov.map(v => v.split(/\s/)[0]))
        dict.starts[word] = dict.starts[word] ? dict.starts[word] + 1 : 1;
      for (const word of markov.map(v => v.split(/\s/).reverse()[0]))
        dict.ends[word] = dict.ends[word] ? dict.ends[word] + 1 : 1;
      const conv = (o: T) =>
        Object.entries(o)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(
            ([K, V]) =>
              `${
                Util.escapeInlineCode(K) || 'nothing?! must be a bug.'
              } (\`${V}\`)`
          )
          .join(', ');
      message.channel.send(
        `Analyzed markov!\n\nMost common words: ${conv(
          dict.words
        )}.\nMost common start of sentences: ${conv(
          dict.starts
        )}.\nMost common end of senteces: ${conv(dict.ends)}`
      );
      return true;
    } else if (args[0] === 'count')
      return message.channel
        .send(markov.length + ' messages collected')
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
      message.channel.send(
        `Successfully loaded ${
          msgs instanceof Collection ? msgs.size : 1
        } message(s)`
      );
      return true;
    }
    message.channel.startTyping();
    let getWord = () =>
        markov.map(v => v.match('\\S+')?.[0] ?? v)[
          Math.floor(Math.random() * markov.length)
        ],
      word = getWord(),
      text = word;
    const averArr: number[] = [];
    for (const str of markov) averArr.push(str.length);
    const getNum = () =>
      Math.round(
        (averArr.reduce((a, b) => a + b) / averArr.length) *
          Math.floor(Math.random() * 5)
      ) + 1;
    let num = getNum();
    while (num <= 3) num = getNum();
    const regexp = () =>
      new RegExp(
        String.raw`\b(${word.replace(
          /[()\][\/\$\^\*\+\?]/g,
          v => '\\' + v
        )})\b([,\.!\?;:\-'"/)([\]](\S+)?)?(\s*\S+)?`,
        'gi'
      );
    function makeSentence() {
      for (let i = 0; i < num; i++) {
        const matched_sentences = markov
          .map(v => v.match(regexp()))
          .filter(v => v)
          .flat();
        const occurences: Record<string, number> = {};
        if (
          (matched_sentences.length === 0 ||
            !matched_sentences.every(
              v => v.toLowerCase() !== word.toLowerCase()
            )) &&
          text.split(/\s+/).length <= 5
        ) {
          word = getWord();
        } else {
          for (const iterator of matched_sentences)
            occurences[iterator as string] = occurences[iterator as string]
              ? occurences[iterator as string] + 1
              : 1;
          if (matched_sentences.length) {
            let tmpPrediction = Object.entries(occurences)
              .sort(([, a], [, b]) => b - a)
              .map(v => v[0]);
            let prediction = tmpPrediction.filter(
              ([, v], _, a) => v === a[0][1]
            );
            prediction =
              prediction.length < 3 ? tmpPrediction.slice(0, 3) : prediction;
            tmpPrediction = shuffle(prediction);
            let actualPrediction: string = tmpPrediction[
              Math.floor(Math.random() * tmpPrediction.length)
            ].split(/\s+/) as any;
            actualPrediction = actualPrediction[1] ?? actualPrediction[0];
            const alreadyPredicted = text.split(/\s+/).reverse();
            function check(n: number) {
              return actualPrediction == alreadyPredicted[n];
            }
            function recCheck(n: number) {
              let i = 0,
                c = false;
              while (!c && i < n) {
                c = check(i);
                i++;
              }
              return c;
            }
            if (actualPrediction === word || recCheck(5)) {
              if (alreadyPredicted.length < 5) word = getWord();
              else break;
            } else {
              const t = actualPrediction;
              text += t ? ' ' + t : '';
              word = actualPrediction;
            }
          }
        }
      }
      console.log('Generated sentence: ', text);
    }
    makeSentence();
    const argR = new RegExp('\\b' + args[0] + '\\b');
    if (args[0] && !argR.test(text)) {
      for (let i = 0; i < 1000 && !argR.test(text); i++) {
        text = getWord();
        word = text;
        makeSentence();
      }
      if (!argR.test(text)) text = 'NONE_FOUND_ENONEFOUND';
    }
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
