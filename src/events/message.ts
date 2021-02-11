import { Client, Message } from 'discord.js';
import { commands } from '..';
import { PREFIXES } from '../constants';
import { Command } from '../types';
import {
  permissionLevels,
  permissionLevelsArray,
  permissionLevelsVerbose,
} from '../util/';

export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  async function handleCommand(
    prefix: string,
    isExclamation: boolean = false
  ): Promise<boolean> {
    if (!message.content?.startsWith(prefix)) return false;
    let args: string[] = message.content.slice(prefix.length).split(/ +/);
    const command: Command | undefined = commands.get(args[0]),
      commandName = args[0];
    if (!command) return true;
    args = args.slice(1);
    if (
      command.permLevel &&
      permissionLevelsArray[command.permLevel] &&
      !permissionLevels[
        permissionLevelsVerbose[command.permLevel]
      ].every(permission => message.member?.permissions.has(permission))
    )
      return true;
    return command.execute({
      client,
      message,
      args,
      commands,
    });
  }
  for (let prefix of PREFIXES) handleCommand(prefix, prefix === '!');
  return true;
};
