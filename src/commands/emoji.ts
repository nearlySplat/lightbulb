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
import { Emoji, GuildEmoji, MessageEmbed, Util } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata } from '../types';

export const meta: CommandMetadata = {
  name: 'emoji',
  description: 'Shows information about an emoji',
  aliases: ['showemoji', 'ei', 'emojiinfo'],
  accessLevel: 0,
  params: [{ type: 'string', name: 'target' }],
};

export const execute: CommandExecute = ctx => {
  let target: Emoji | GuildEmoji = new Emoji(
    ctx.message.client,
    Util.parseEmoji(ctx.args.data.target)
  );
  target = ctx.message.client.emojis.cache.get(target.id) || target;
  const asset =
    target.url ||
    `https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/${decodeURIComponent(
      target.identifier
    )
      .charCodeAt(0)
      .toString(16)}.svg`;
  const embed = new MessageEmbed()
    .setColor(CLIENT_COLOUR)
    .setAuthor(`Emoji Information for ${target.identifier}`)
    .addFields(
      { name: 'ID', value: target.id || decodeURIComponent(target.identifier) },
      { name: 'Name', value: target.name },
      {
        name: 'Image URL',
        value: asset,
      }
    );
  ctx.message.reply(embed);
};
