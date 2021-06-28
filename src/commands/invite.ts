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
import { Permissions, PermissionFlags } from 'discord.js';

export const execute: CommandExecute = ({ message, args }) => {
  return [
    {
      content: `<https://discord.com/oauth2/authorize?client_id=${
        args.data.application?.replace(/(<@!?|>)/g, '') ||
        message.client.user?.id
      }&scope=bot${
        args.data.perms
          ? `&permissions=${args.data.perms
              .split(' +')
              .map(v =>
                v === 'admin'
                  ? Permissions.FLAGS.ADMINISTRATOR
                  : Permissions.FLAGS[
                      v.toUpperCase() as keyof PermissionFlags
                    ] ?? BigInt(+v)
              )
              .reduce((prev, curr) => prev + curr)}`
          : ''
      }>`,
    },
    null,
  ];
};

export const meta: CommandMetadata = {
  name: 'invite',
  description: 'Gets an invite link for me or any bot.',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'application',
      type: 'string',
    },
    {
      name: 'perms',
      type: 'string',
      rest: true,
      optional: true,
    },
  ],
};
