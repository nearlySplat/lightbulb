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
import { Util } from 'discord.js';
import { Context, CommandMetadata } from '../types';
import { getProgressBar } from '../util';
// import { get, interpolate } from '../util/i18n';
export const execute = ({
  message,
  args,
}: Context): boolean | Promise<boolean> => {
  const progress = getProgressBar(36, ':radio_button:');
  const num = (progress.indexOf(':radio_button:') / progress.length) * 100;
  const flooredNum = Math.floor(num);
  const rand = Math.floor(Math.random() * 1000);
  const played = rand * (flooredNum / 100);
  const convert = (n: number) =>
    n
      .toFixed()
      .replace(/(\d)(\d{2})/g, '$1.$2')
      .replace(/^(\d{2})$/g, '0.$1')
      .replace(/^(\d{1})$/g, '0.0$1');
  const soundBar = getProgressBar(4, '○');
  const soundLocation = parseInt(
    ((soundBar.indexOf('○') / soundBar.length) * 100).toFixed()
  );
  const howMuchSound = (3 * (soundLocation / 100)).toFixed();
  let soundEmoji: string = '';
  switch (howMuchSound) {
    case '0':
      soundEmoji = '🔇';
      break;
    case '1':
    case '2':
      soundEmoji = '🔉';
      break;
    case '3':
      soundEmoji = '🔊';
  }
  const title = Util.escapeMarkdown(
    args.join(' ').replace(/\b\w/g, v => v.toUpperCase()) ||
      'Who Asked (Feat: Nobody)'
  );
  message.channel.send(
    `**${title}**\n${progress}\n${soundEmoji} ${soundBar}                             ◄◄⠀▐▐ ⠀►►⠀⠀ ⠀ ${convert(
      played
    )} / ${convert(rand)} ⠀                       ᴴᴰ ⚙ ❐`
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'play',
  description: 'Play a song',
  accessLevel: 0,
  aliases: ['np', 'nowplaying'],
  hidden: true,
};
