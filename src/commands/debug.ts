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
import { Intents, MessageEmbed } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { startedTimestamp } from '..';
import { CLIENT_COLOUR, INTENTS } from '../constants';
import { CommandMetadata, Context } from '../types';
export const execute = async ({
  message,
  commands,
  client,
  commandHandlerStarted,
}: Context): Promise<boolean> => {
  const events = readdirSync(join(__dirname, '..', 'events'));
  const _ = new MessageEmbed()
    .setAuthor('Debug Information')
    .setDescription(
      `
      - I am currently on shard \`${message.guild?.shardID}\` with \`${
        commands.size
      }\` commands.
        - I have requested gateway intents of \`${INTENTS}\` (${new Intents(
        INTENTS
      )
        .toArray()
        .map(v => `\`${v}\``)}).
        - I am ${
          !(await client.fetchApplication()).botPublic ? '**not** ' : ''
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
  `.replace(/\n +/g, '\n')
    )
    .setColor(CLIENT_COLOUR)
    .setThumbnail(client.user?.avatarURL() as string)
    .setFooter(
      `Requested by ${message.author.tag} (${message.author.id})`,
      message.author.avatarURL() as string
    );
  message.channel.send(_);
  return true;
};

export const meta: CommandMetadata = {
  name: 'debug',
  description: 'Get debug information about the bot',
  accessLevel: 0,
  aliases: ['ping'],
};
