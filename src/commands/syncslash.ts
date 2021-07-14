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
import { slashCommands } from '..';

export const meta: CommandMetadata = {
  name: 'syncslash',
  description: 'Syncs slash commands (owner only)',
  accessLevel: 3,
  aliases: ['syncinteractions', 'slashsync'],
};

export const execute: CommandExecute = async ({ client, message, t }) => {
  const curr = await client.api
    .applications(client.user!.id)
    .commands.get<{ name: string }[]>();
  const toAdd = slashCommands.filter(
    ({ meta: { name } }) => !curr.find(({ name: iName }) => iName === name)
  );
  if (!toAdd.size) {
    message.channel.send(t('slashsync.no_targets'));
    return false;
  }
  for (const [, command] of toAdd)
    client.api.applications(client.user!.id).commands.post({
      data: command.meta as unknown as Record<string, unknown>,
    });
  return [
    {
      content: t('slashsync.successWithCount', {
        count: toAdd.size,
      }),
    },
    null,
  ];
};
