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
import { Intents, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { startedTimestamp } from '..';
import { CLIENT_COLOUR, INTENTS } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';
import fs from 'fs';
import child_process from 'child_process';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const commit = child_process.execSync('git log -n 1 --format="%H"').toString();
// eslint-disable-next-line no-undef
const events = readdirSync(join(__dirname, '..', 'events'));
export const execute: CommandExecute = async ({
  message,
  commands,
  client,
  commandHandlerStarted,
}) => {
  return [
    {
      embed: new MessageEmbed()
        .setAuthor(`Lightbulb v${pkg.version} Debug Information`)
        .setDescription(
          `
      - I am currently on shard \`${message.guild?.shardID}\` with \`${
            commands.size
          }\` commands.
        - I have requested gateway intents of \`${INTENTS}\` (${new Intents(
            INTENTS
          )
            .toArray()
            .map(v => `\`${v}\``)
            .join(', ')}).
        - I am ${
          !(await client.application.fetch()).botPublic ? '**not** ' : ''
        }available to invite to guilds.
        - Available events are ${events
          .map(
            v =>
              `\`${v
                .replace(/\.[jt]s/g, '')
                .replace(/([a-z])([A-Z])/g, '$1_$2')
                .toUpperCase()}\``
          )
          .join(', ')}.
          - It took a total of \`${
            (client.readyTimestamp as number) - startedTimestamp
          }ms\` for me to boot.
          - Command handler latency is \`${
            Date.now() - commandHandlerStarted
          }ms\`.
	  - I have ${
      Object.keys(pkg.dependencies).length
    } Node.js dependencies installed.
	  - I am on commit [\`${commit}\`](https://github.com/nearlySplat/lightbulb/commit/${commit})
).
  `.replace(/\n +/g, '\n')
        )
        .setColor(CLIENT_COLOUR)
        .setThumbnail(client.user?.avatarURL() as string)
        .setFooter(
          `Requested by ${message.author.tag} (${message.author.id})`,
          message.author.avatarURL() as string
        ),
    },
    null,
  ];
};

export const meta: CommandMetadata = {
  name: 'debug',
  description: 'Get debug information about the bot',
  accessLevel: 0,
  aliases: ['ping'],
};
