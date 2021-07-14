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
import { CommandMetadata, CommandExecute, Command } from '../types';
import fs from 'fs/promises';
import { commands } from '..';
import { formatBytes } from '../util';
import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
export const meta: CommandMetadata = {
  name: 'reload',
  description: 'Reloads a command',
  aliases: [],
  accessLevel: 'OWNER',
  params: [{ name: 'files', type: 'string', rest: true, optional: true }],
};

export const execute: CommandExecute = async ctx => {
  const files = ctx.args.data.files
    ? ctx.args.data.files.split(' ')
    : Object.keys(commands);
  const done: [boolean, string, string][] = [];
  for (const file of files) {
    // eslint-disable-next-line no-undef
    const path = require.resolve(`./${file}`);
    const stats = await fs.stat(path);
    if (stats.isDirectory()) {
      files.push(...(await fs.readdir(path)));
      continue;
    }
    const size = formatBytes(stats.size);
    // eslint-disable-next-line no-undef
    delete require.cache[path];
    let data: Command;
    try {
      data = await import(path);
    } catch {
      done.push([false, file, size]);
      continue;
    }
    commands.set(file, data);
    done.push([true, file, size]);
  }
  return [
    {
      embed: new MessageEmbed()
        .setColor(ctx.message.guild.me.roles.color.color || CLIENT_COLOUR)
        .setAuthor('Reload')
        .addFields(
          {
            name: ctx.t('reload.succeeded'),
            value:
              done
                .filter(([done]) => done)
                .map(([, name, size]) => `${name} - ${size}`)
                .join('\n') || 'None',
          },
          {
            name: ctx.t('reload.failed'),
            value:
              done
                .filter(([done]) => !done)
                .map(([, name, size]) => `${name} - ${size}`)
                .join('\n') || 'None',
          }
        ),
    },
    null,
  ];
};
