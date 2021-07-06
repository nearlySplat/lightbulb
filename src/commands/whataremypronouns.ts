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
import { MessageEmbed } from 'discord.js';
import { User, IUser } from '../models/User';
import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  name: 'whataremypronouns',
  description: 'When you forget your gender',
  aliases: ['pronouns', 'changemypronounspls'],
  accessLevel: 0,
};

export const execute: CommandExecute = async ctx => {
  const data = await User.findOne({
    uid: ctx.message.author.id,
  }).exec();
  if (!data) {
    ctx.message.channel.send(
      'You do not have any data in our database. `they/them` pronouns will be assumed unless you explicitly set them to anything else.'
    );
  }
  const embed = new MessageEmbed()
    .setAuthor(
      `${ctx.message.author.tag}'s Pronouns`,
      ctx.message.author.displayAvatarURL({
        dynamic: true,
      })
    )
    .setDescription(`Your pronouns are: ${formatPronouns(data.pronouns)}`)
    .setColor(ctx.message.guild.me!.roles.highest.color);
  return [{ embed }, null];
};

export function formatPronouns(pronouns: IUser['pronouns']): string {
  return `${Object.entries(pronouns)
    .filter(([K]) => K !== 'singularOrPlural')
    .map(([, V]) => V)
    .join('/')} (${pronouns.singularOrPlural})`;
}
