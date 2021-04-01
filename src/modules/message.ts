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
import { Client, Message, Util } from 'discord.js';
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
    let markov = fs
      .readFileSync(path.join(__dirname, 'markov.txt'), 'utf-8')
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
      if (
        new RegExp(
          String.raw`^(\w+(\s+)?pls|${PREFIXES.join(' ?|')} ?|<@!?${
            client.user!.id
          }> ?| ?|eureka ?|\w?[!+×÷=\/_€£¥₩@#$^&*()\-':;!?,.\]\[])`,
          'g'
        ).test(message.content)
      )
        return false;
      markov.push(message.cleanContent);
      fs.writeFileSync(
        path.join(__dirname, 'markov.txt'),
        markov.filter(v => v.split(/ +/).length >= 5).join(EOL)
      );
      console.log('written kek');
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
    let getWord = () =>
        markov.map(v => v.match('\\S+')?.[0] ?? v)[
          Math.floor(Math.random() * markov.length)
        ],
      word = args[0] || getWord(),
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
    if (args[0] && !markov.some(v => regexp().test(v))) {
      message.channel.send("They've never said that, sorry...");
      return false;
    }
    console.log(num, averArr);
    function makeSentence() {
      for (let i = 0; i < num; i++) {
        console.log(word);
        const sarr = markov
          .map(v => v.match(regexp()))
          .filter(v => v)
          .flat();
        const obj: Record<string, number> = sarr.length ? {} : { '.': 1 };
        if (
          (sarr.length === 0 ||
            !sarr.every(v => v.toLowerCase() !== word.toLowerCase())) &&
          text.split(/\s+/).length <= 5
        ) {
          // text += [...text].reverse()[0] === "." ? "" : ".";
          word = getWord();
        } else {
          for (const a of sarr)
            obj[a as string] = obj[a as string] ? obj[a as string] + 1 : 1;
          if (sarr.length) {
            console.log(obj);
            let _seq = Object.entries(obj)
              .sort(([, a], [, b]) => b - a)
              .map(v => v[0]);
            console.log(_seq);
            let newSeq = _seq.filter(([, v], _, a) => v === a[0][1]);
            newSeq = newSeq.length < 3 ? _seq.slice(0, 3) : newSeq;
            _seq = shuffle(newSeq);
            let seq: string = _seq[
              Math.floor(Math.random() * _seq.length)
            ].split(/\s+/) as any;
            seq = seq[1] ?? seq[0];
            function check(n: number) {
              return seq == text.split(/\s+/).reverse()[n];
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
            if (seq === word || recCheck(5)) {
              if (text.split(/\s+/).length < 5) word = getWord();
              console.log(text.split(/\s+/).length < 5, word, text);
            } else {
              const t = seq;
              text += t ? ' ' + t : '';
              word = seq;
            }
          }
        }
      }
    }
    makeSentence();
    console.log(text.split(/\s+/).length, text);
    message.channel.send(
      `Well, splat once said...\n> <:splat:826153213321412618> **Splatterxl#8999**\n> ${text}`
    );
    return true;
  },
};
