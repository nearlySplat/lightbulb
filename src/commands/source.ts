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
import { MessageActionRow, MessageButton } from 'discord.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CommandExecute, CommandMetadata } from '../types';

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
  let url =
    'https://github.com/nearlysplat/lightbulb/blob/development/src/commands/';
  const original = url;
  const path = ctx.args.data.file;
  url += ctx.args.data.file + '.ts';
  await r.users.remove(ctx.client.user.id);
  await m.delete();
  if (url === original) return [{ content: 'No such file' }, null];
  const text = await readFile(
    join(__dirname, '..', '..', '..', 'src', 'commands', path + '.ts'),
    'utf-8'
  );
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
              .setLabel(ctx.t('source.link', ctx.locale)),
          ],
        }),
      ],
    },
    null,
  ];
};
