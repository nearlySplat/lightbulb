import { Client, GuildMember, Message } from 'discord.js';
import { commands } from '..';
import { PREFIXES } from '../constants';
import { Command } from '../types';
import { getAccessLevel, getCurrentLevel } from '../util';

export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  if (!message.guild || !message.member) return false;
  async function handleCommand(
    prefix: string,
    isExclamation: boolean = false
  ): Promise<boolean> {
    const timeStarted = Date.now();
    if (!message.content?.startsWith(prefix)) return false;
    let args: string[] = message.content.slice(prefix.length).split(/ +/);
    const command: Command | undefined = commands.get(args[0]),
      commandName = args[0];
    if (!command) return false;
    args = args.slice(1);
    if (
      command.meta?.accessLevel &&
      getCurrentLevel(message.member as GuildMember) <
        getAccessLevel(command.meta.accessLevel as 0 | 1 | 2 | 3)
    )
      return false;
    if (isExclamation && ['reason'].includes(commandName))
      return command.execute({
        client,
        message,
        args,
        commands,
        commandHandlerStarted: timeStarted,
        accessLevel: getCurrentLevel(message.member as GuildMember),
      });
    else if (!isExclamation)
      return command.execute({
        client,
        message,
        args,
        commands,
        commandHandlerStarted: timeStarted,
        accessLevel: getCurrentLevel(message.member as GuildMember),
      });
    else return false;
  }
  for (let prefix of PREFIXES) handleCommand(prefix, prefix === '!');
  return true;
};
