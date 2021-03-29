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
import { CommandExecute, CommandMetadata } from '../types';
import { accessLevels, getAccessLevel, toProperCase } from '../util';
import { get } from '../util/i18n';

export const execute: CommandExecute<'commandName'> = ({
  message,
  locale,
  commands,
  args,
}) => {
  if (!args[0]) message.channel.send(get('HELP_ARRIVED', locale));
  else
    message.channel.send(
      (commands.has(args[0])
        ? `\`\`\`ini\n${constructHelpCommand(
            commands.get(args.data!.commandName)!.meta
          )}\`\`\``
        : get('HELP_ARRIVED', locale)) ?? 'No data.'
    );
  return true;
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'commandName',
      type: 'string',
      optional: true,
    },
  ],
};

function constructHelpCommand(cmd: CommandMetadata) {
  const data: [string, string][] = Object.entries(cmd)
    .map<[string, any]>(([K, V]) => [toProperCase(K), V])
    .filter(([, V]) => ['string', 'number'].includes(typeof V));
  if (cmd.params)
    data.push([
      'Usage',
      cmd.params
        .map(
          v =>
            `${v.optional ? '[' : '<'}${v.name} :: ${
              v.options ? v.options.map(v => `"${v}"`).join(' | ') : v.type
            }${v.optional ? ']' : '>'}`
        )
        .join(' '),
    ]);
  data[data.findIndex(([K]) => K === 'AccessLevel') ?? data.length] = [
    'AccessLevel',
    Object.keys(accessLevels)[getAccessLevel(cmd.accessLevel)],
  ];
  return data.map(([K, V]) => `[${K}]: ${V}`).join('\n');
}
