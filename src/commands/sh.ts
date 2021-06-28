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
import { spawn } from 'child_process';

export const meta: CommandMetadata = {
  name: 'sh',
  description: 'yeah',
  accessLevel: 'OWNER',
  params: [{ name: 'commands', type: 'string', rest: true }],
  aliases: ['exec'],
};

export const execute: CommandExecute<'commands'> = ({ args, message }) => {
  return new Promise(async res => {
    const m = await message.channel.send({
      content: `\`\`\`xl\n$ ${args.data.commands}\`\`\``,
      code: 'xl',
    });
    let exited: string;
    const data: Buffer[] = [];
    let col = {
      start: 0,
      end: 50,
    };
    for (const x of ['⬆️', '⏹', '⬇️']) m.react(x);
    const get_lines = (d: string) =>
      d
        .split(/(\r?\n)+/)
        .slice(col.start, col.end)
        .join('')
        .slice(0, 1850);
    const update = () =>
      m.edit(
        `\`\`\`xl\n$ ${args.data.commands}\n\n${get_lines(
          data.join('')
        )}${`\n\n${exited ? exited : ''}${
          exited && col.end >= data.join('').split(/(\r?\n)+/).length
            ? ' | '
            : ''
        }${
          col.end >= data.join('').split(/(\r?\n)+/).length
            ? ` Columns ${col.start}-${col.end} of ${
                data.join('').split(/(\r?\n)+/).length
              }`
            : ''
        }`.trim()}\`\`\``
      );
    const update_lines = (t: 'up' | 'down') => {
      if (t === 'up') {
        col.start++;
        col.end++;
      } else {
        col.start--;
        col.end--;
      }
      if (col.start < 0 || col.end > data.join('').split(/(\r?\n)+/).length) {
        col.start = 0;
        col.end = 50;
      }
    };
    const child = spawn(args.data.commands, {
      shell: true,
    });
    const handler = (d: any) => {
      data.push(Buffer.from(d.toString()));
      update();
    };
    child.stdout.on('data', handler);
    child.stderr.on('data', handler);
    child.stdout.on('error', handler);
    child.stderr.on('error', handler);
    child.on('error', handler);

    child.on('exit', (code, signal) => {
      let d = 'Exited with ';
      function push(t: Buffer) {
        d += t.toString();
      }
      if (signal || code) {
        if (signal) push(Buffer.from(`signal ${signal}`));
        if (code && signal) push(Buffer.from(' and '));
        if (code) push(Buffer.from(`code ${code}`));
      } else push(Buffer.from('code 0'));
      push(Buffer.from('.'));
      exited = d;
      update();
      coll.stop();
      res(!!code);
    });
    const coll = message.channel.createMessageCollector(
      m => m.author.id === message.author.id
    );
    coll.on('collect', m => {
      if (m.content === '^D') {
        coll.stop();
        r_coll.stop();
        child.kill('SIGKILL');
        return;
      }
      if (m.content === '^C') {
        coll.stop();
        r_coll.stop();
        child.kill('SIGINT');
        return;
      }
      child.stdin.write(m.cleanContent);
      data.push(Buffer.from(`\n> ${m.cleanContent}\n`));
      update();
    });
    /**
     * @todo Find a way to use buttons in `sh`
     * @body Currently, this command uses reactions (which are very ugly) instead of buttons. The issue with this is that the current way I use to handle buttons requires me to return a value, and that would hang the child process.
     */
    const r_coll = m.createReactionCollector(
      (_, u) => u.id === message.author.id
    );
    r_coll.on('collect', r => {
      switch (r.emoji.name) {
        case '⏹': {
          coll.stop();
          r_coll.stop();
          child.kill('SIGINT');
          break;
        }
        case '⬆️': {
          update_lines('up');
          update();
          break;
        }
        case '⬇️': {
          update_lines('down');
          update();
          break;
        }
      }
    });
  });
};
