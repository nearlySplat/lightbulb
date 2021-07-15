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
import { GuildMember } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';

export const execute: CommandExecute = ({ message, commands, args, t }) => {
  if (!args[0])
    return [
      {
        content: commands
          .filter(
            v =>
              v &&
              v.meta &&
              v.execute &&
              getCurrentLevel(message.member as GuildMember) >=
                getAccessLevel(v.meta.accessLevel)
          )
          .map(({ meta: { name, description } }) => name + ' - ' + description)
          .join('\n'),
        code: 'md',
      },
      null,
    ];
  else return [{ content: t('commands.help') }, null];
};

export const meta: CommandMetadata = {
  name: 'help',
  description: 'Lists the commands of the bot.',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'args',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};
