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
import { inspect } from 'util';
import { WHITELIST } from '../constants';
import { CommandMetadata, Context } from '../types';
import { transpile } from 'typescript';
export const execute = async ({ message, args }: Context): Promise<boolean> => {
  if (!WHITELIST.includes(message.author.id)) return true;
  const raw = args.join(' ');
  let output: any;
  try {
    output = eval(
      transpile(raw, {
        experimentalDecorators: true,
        esModuleInterop: true,
        checkJs: true,
        allowUnusedLabels: false,
        allowUmdGlobalAccess: false,
        allowSyntheticDefaultImports: false,
        allowUnreachableCode: false,
        noImplicitAny: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
      })
    );
  } catch (error) {
    output =
      error.stack?.replace(
        new RegExp(__dirname.replace(/\/commands^/g, ''), 'g'),
        '/root/eureka'
      ) ?? error;
  }
  let type: string | undefined = output?.name ?? output?.constructor?.name;
  if (type === 'Promise') {
    try {
      output = await output;
      type = `Promise<${output?.name ?? output?.constructor?.name}>`;
    } catch (e) {
      output = e;
      type = 'Promise { <rejected> }';
    }
  }
  output =
    typeof output === 'string'
      ? output
      : (inspect(output, {
          depth: 0,
        }) as string & { name: string });
  message.channel.send(
    output?.slice(0, 1850) + '\nTypeof [' + type + '] => ' + output?.length ??
      'No output.',
    {
      code: 'js',
    }
  );
  return true;
};

export const meta: CommandMetadata = {
  name: 'eval',
  description: 'Evaluate JavaScript code.',
  accessLevel: 3,
  aliases: [],
  params: [
    {
      name: 'code',
      type: 'string',
      rest: true,
    },
  ],
};
