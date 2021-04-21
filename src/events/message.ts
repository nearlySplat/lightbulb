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
import { Client, ClientUser, Guild, GuildMember, Message } from 'discord.js';
import { commands } from '..';
import { PREFIXES } from '../constants';
import { Command } from '../types';
import {
  CommandParameters,
  getAccessLevel,
  getCurrentLevel,
  i18n,
} from '../util';
import { tags } from '../util/tags';

export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  if (!message.guild || !message.member) return false;
  const isKsIn = !!(await message
    .guild!.members.fetch('236726289665490944')
    .catch(() => null));
  async function handleCommand(
    prefix: string,
    isExclamation = false
  ): Promise<boolean> {
    const timeStarted = Date.now();
    if (!message.content?.startsWith(prefix)) return false;
    let args: string[] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);
    const command: Command | undefined =
        commands.get(args[0]) ??
        commands.find(value => value.meta?.aliases.includes(args[0]) ?? false),
      commandName = args[0];
    if (!command) {
      if (tags.has(commandName) || tags.has(args.join(' '))) {
        let result = tags.get(args.join(' ')) || tags.get(commandName);
        if (Array.isArray(result))
          result = result[Math.floor(Math.random() * result.length)];
        result = i18n.interpolate(result, { args0: args[0] });
        message.channel.send(result);
        return true;
      } else return false;
    }
    args = args.slice(1);
    if (
      command.meta?.accessLevel &&
      getCurrentLevel(message.member as GuildMember) <
        getAccessLevel(command.meta.accessLevel as 0 | 1 | 2 | 3)
    )
      return false;
    let paramInstance;
    try {
      paramInstance = await CommandParameters.from(command.meta, args);
    } catch (e) {
      CommandParameters.triggerError(
        message.channel.send.bind(message.channel),
        e
      );
      return false;
    }
    if ((isExclamation && ['reason'].includes(commandName)) || !isExclamation)
      return command.execute({
        client,
        message: message as Message & { member: GuildMember; guild: Guild },
        args: paramInstance,
        commands,
        commandHandlerStarted: timeStarted,
        accessLevel: getCurrentLevel(message.member as GuildMember),
        locale: 'en_UK',
        commandName,
      });
    else return false;
  }
  for (const prefix of [
    `<@${(client.user as ClientUser).id}>`,
    `<@!${client.user!.id}>`,
    ...PREFIXES,
  ].filter(v => v !== 'pls' || !isKsIn))
    handleCommand(prefix, prefix === '!');
  return true;
};
