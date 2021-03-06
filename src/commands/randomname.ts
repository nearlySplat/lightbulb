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
import { CLIENT_COLOUR } from '../constants.js';
import { CommandExecute, CommandMetadata } from '../types.js';
import fs from 'fs';
import { MessageEmbed } from 'discord.js';
const names = JSON.parse(fs.readFileSync('./assets/names.json', 'utf-8'));

export const meta: CommandMetadata = {
  name: 'randomname',
  description:
    "Get a randomly generated name. Apologies to any real people who see their own name; don't worry, we don't know where you live... yet:tm:",
  aliases: ['name'],
  accessLevel: 0,
};
export const execute: CommandExecute = ctx => [
  {
    content: ctx.t('generic.generated', { thing: 'name' }),
    embed: new MessageEmbed({
      color: ctx.message.guild.me!.roles.color.color || CLIENT_COLOUR,
      description:
        names.firstNames[Math.floor(Math.random() * names.firstNames.length)] +
        ' ' +
        names.lastNames[Math.floor(Math.random() * names.lastNames.length)],
    }),
  },
  null,
];
