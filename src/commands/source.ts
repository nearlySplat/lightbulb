/* eslint-disable no-undef */
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
import { CommandExecute, CommandMetadata } from '../types';

import { opendir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { MessageActionRow, MessageButton } from 'discord.js';
async function* walk(
  path: string,
  cb: (file: string) => boolean
): AsyncIterable<string> {
  const dir = await opendir(path);

  for await (const item of dir) {
    const file = join(dir.path, item.name);
    if (item.isFile()) {
      if (cb(file)) yield file;
    } else if (item.isDirectory()) {
      yield* walk(file, cb);
    }
  }
}
const files: string[] = [];
(async () => {
  const gitignore = await readFile(
    resolve(__dirname, '..', '..', '.gitignore'),
    'utf-8'
  );
  for await (const file of walk(
    resolve(__dirname, '..', '..'),
    file =>
      !gitignore
        .split('\n')
        .filter(v => v)
        .some(v =>
          file.replace(resolve(__dirname, '..', '..'), '').startsWith(v)
        )
  )) {
    files.push(file);
  }
})();
export const meta: CommandMetadata = {
  name: 'source',
  description: 'Finds the source for an event or command on GitHub',
  aliases: ['src', 'source', 'sourcecode', 'srccode'],
  params: [{ name: 'file', type: 'string', rest: true, optional: false }],
  accessLevel: 0,
};

export const execute: CommandExecute = async ctx => {
  const m = await ctx.message.channel.send('Working on it...');
  const r = await ctx.message.react('a:loading:833416988981723147');
  let url = 'https://github.com/nearlysplat/lightbulb/blob/development/';
  const original = url;
  let path;
  for (let file of files) {
    file = file.replace(resolve(__dirname, '..', '..') + '/', '');
    console.log(file);
    if (
      [
        'src/',
        'src/commands/',
        'src/events/',
        'src/events/ws/',
        'src/commands/slash/',
        '',
      ]
        .map(v => v + file)
        .includes(ctx.args.data.file)
    ) {
      path = file;
      url += file;
      break;
    }
  }
  console.log(url, original);
  await r.users.remove(ctx.client.user.id);
  await m.delete();
  if (url === original) return [{ content: 'No such file' }, null];
  const text = await readFile(join(__dirname, '..', '..', path), 'utf-8');
  return [
    {
      content: `<${url}>\n${
        path
          ? `\`\`\`xl\n${text.slice(0, 1850)}${
              text.length >= 1850 ? '...' : ''
            }\n\`\`\``
          : ''
      }`,
      components: [
        new MessageActionRow({
          components: [
            new MessageButton()
              .setURL(url)
              .setStyle('LINK')
              .setLabel('Take us into Hyperspace, Chewie!'),
          ],
        }),
      ],
    },
    null,
  ];
};
