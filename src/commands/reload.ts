// eslint-disable no-undef 
// ^ for require not being defined
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
    const path = require.resolve(`./${file}`);
    const stats = await fs.stat(path);
    if (stats.isDirectory()) {
      files.push(...(await fs.readdir(path)));
      continue;
    }
    const size = formatBytes(stats.size);
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
            name: 'Succeeded',
            value:
              done
                .filter(([done]) => done)
                .map(([, name, size]) => `${name} - ${size}`)
                .join('\n') || 'None',
          },
          {
            name: 'Failed',
            value: done
              .filter(([done]) => !done)
              .map(([, name, size]) => `${name} - ${size}`)
              .join('\n') || 'None',
          }
        ),
    },
    null,
  ];
};
