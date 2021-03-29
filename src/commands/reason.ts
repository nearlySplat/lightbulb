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
import {
  Client,
  Guild,
  GuildMember,
  Permissions,
  Snowflake,
  TextChannel,
  User,
  Message,
} from 'discord.js';
import { createLogMessage, getCases } from '../util';
import { CLIENT_COLOUR } from '../constants';
import { CommandExecute, CommandMetadata, Context } from '../types';

export const execute = async ({ message, args }: Context): Promise<any> => {
  if (
    !(message.guild as Guild).me?.permissions.has(
      Permissions.FLAGS.VIEW_AUDIT_LOG
    )
  )
    return;
  const channel = (message.guild as Guild).channels.cache.find(
    value =>
      ((value.name?.match(/^💡(-log(s|ging)?)?$/g) ||
        value.topic?.includes('--lightbulb-logs')) &&
        value.type == 'text' &&
        value
          .permissionsFor((message.guild as Guild).me as GuildMember)
          ?.has('SEND_MESSAGES')) ??
      false
  ) as TextChannel;
  await channel.messages.fetch({});
  async function updateMessages(cases: (number | string)[]) {
    let err;
    for (let value of cases) {
      console.log(value, cases);
      const message1 =
        value == 'l'
          ? channel?.messages.cache
              .filter(v => v.author.id === message.client.user?.id)
              .map(v => v)
              .sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0]
          : channel?.messages.cache.find(
              v =>
                v.content.startsWith(`\`[Case ${value}]\``) &&
                v.author.id === message.client.user?.id
            );
      if (!message1) {
        err = true;
        break;
      }
      const matchedUser = message1.content
        .match(/ed]` \*\*[^#]+#\d{4}\*\* \(\d+\)/g)?.[0]
        ?.match(/\d{4}\d+/g)?.[0];
      const user = await message.client.users
        ?.fetch(`${matchedUser}`)
        .catch(() => null);
      if (!user) throw message.react('😔');
      if (channel) {
        const result = createLogMessage({
          compact: channel.topic?.includes('--compact'),
          victim: {
            tag: user.tag,
            id: user.id,
          },
          perpetrator: {
            id: message.author.id,
            tag: message.author.tag,
          },
          reason:
            args.slice(1).join(' ') ||
            (message1.content
              .match(/\n`[Reason]` .*/gi)?.[0]
              .replace(/^\n`[Reason]` /gi, '') as string),
          case: parseInt(
            message1.content
              .match(/Case \d+/g)?.[0]
              .match(/\d+/g)?.[0] as string
          ),
          action: message1.content
            .match(/(ban|kick|unban)(n{1,2})?ed/g)?.[0]
            .replace(/\b\w/g, v => v.toUpperCase())
            .replaceAll('ed', '')
            .replace(/n{2,4}$/g, 'n') as string,
          emoji: message1.content.match(/(👢|🔨|🔧)/g)?.[0] as string,
        });
        message1.edit(result);
      }
    }
    return true;
  }
  if (args[0].includes('..')) {
    const nums = args[0]
      .split('..')
      .reverse()
      .map(v => parseInt(v));
    const cases = Array.from(
      { length: nums.reduce((a, b) => a - b) + 1 },
      (_, i) => i + 1
    ).map(v => v + nums[1] - 1);
    await message.channel.send(`How many cases will this affect?`);
    await message.channel
      .awaitMessages(m => m.author.id == message.author.id, { max: 1 })
      .then(v =>
        parseInt((v.first() as Message).content) === cases.length
          ? updateMessages(cases)
              // .catch(() => null)
              .then(v =>
                v
                  ? message.channel.send(`👌 Updated ${cases.length} cases.`)
                  : message
              )
          : message.channel.send('Bruh your math sucks.')
      );
  } else
    updateMessages([args[0]])
      // .catch(() => null)
      .then(v => (v ? message.channel.send('👌') : null));
};

export const meta: CommandMetadata = {
  name: 'reason',
  description: 'Edits a reason in the mod log.',
  accessLevel: 1,
  aliases: [],
};
