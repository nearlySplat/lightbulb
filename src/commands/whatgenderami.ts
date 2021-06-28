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
import { get, interpolate } from '../util/i18n';
import { getMember } from '../util';

export const execute: CommandExecute = ({
  message,
  locale,
  commandName,
  args,
}) => {
  if (!args.data.user && commandName === 'whatgenderami')
    return [
      {
        content: interpolate(get('WHATGENDERAMI_TEXT', locale), {
          gender: get('WHATGENDERAMI', locale),
        }),
      },
      null,
    ];
  if (!args.data.user)
    return [
      {
        content: get('WHATGENDERAMI_USE_I', locale),
      },
      null,
    ];
  else {
    const user =
      getMember(message.guild, args.data.user)?.user ?? args.join(' ');
    // @ts-ignore
    const target = (user.tag ?? args.data.user)?.replace(
      /^[^#]+/g,
      (v: string) => `**${v}**`
    );
    return [
      {
        content: interpolate(get('WHATGENDERARETHEY', locale), {
          gender: get('WHATGENDERAMI'),
          target,
        }),
      },
      null,
    ];
  }
};

export const meta: CommandMetadata = {
  name: 'whatgenderami',
  description: 'what is your true gender',
  accessLevel: 0,
  aliases: ['whatgenderis'],
  params: [
    {
      name: 'user',
      type: 'string',
      optional: true,
      rest: true,
    },
  ],
};
