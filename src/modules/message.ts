import { Client, Message, User } from 'discord.js';
import { WHITELIST } from '../constants';
import fs from 'graceful-fs';
import path from 'path';
import { EOL } from 'os';
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
        /^(\w+(\s+)?pls|pls ?|[!+×÷=\/_€£¥₩@#$^&*()\-':;!?,.\]\[])/g.test(
          message.content
        )
      )
        return false;
      markov.push(message.cleanContent);
      fs.writeFileSync(path.join(__dirname, 'markov.txt'), markov.join(EOL));
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
          .map(([K, V]) => `${K} (\`${V}\`)`)
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
      word = message.content.match(/\S+/g)?.[1] ?? getWord(),
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
    console.log(word);
    if (
      !markov.some(v =>
        v.match(
          new RegExp(
            `\\b${word.replace(/[()\][\/\$\^\*\+\?]/g, v => '\\' + v)}\\b`
          )
        )
      )
    ) {
      message.channel.send("They've never said that, sorry...");
      return false;
    }
    console.log(num, averArr);
    for (let i = 0; i < num; i++) {
      const sarr = markov
        .map(v =>
          v.match(
            new RegExp(
              String.raw`\b(${word.replace(
                /[()\][\/\$\^\*\+\?]/g,
                v => '\\' + v
              )})\b([,\.!\?;:\-'"/)([\]](\S+)?)?(\s+\S+)?`,
              'gi'
            )
          )
        )
        .filter(v => v)
        .flat(2);
      const obj: Record<string, number> = {};
      console.log(sarr);
      console.log(text);
      for (const a of sarr)
        obj[a as string] = obj[a as string] ? obj[a as string] + 1 : 1;
      if (sarr.length) {
        console.log(obj);
        let _seq = Object.entries(obj)
          .reduce(([ak, av], [bk, bv]) => (av >= bv ? [ak, av] : [bk, bv]))[0]
          .match(/\S+/g) ?? [''];
        const seq = _seq[1] ?? _seq[0];
        if (seq === word)
          if (text.split(/\s+/).length <= 1) word = getWord();
          else {
          }
        else {
          const t = seq;
          text += t ? ' ' + t : '';
          word = seq;
        }
      }
    }
    message.channel.send(
      `Well, splat once said...\n> <:splat:821046564474585128> **Splatterxl#8999**\n> ${text}`
    );
    return true;
  },
};
