import { Client, Message } from 'discord.js';
import { commands } from '..';
import { PREFIXES } from '../constants';
import { Command } from '../types';

export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
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
    if (isExclamation && !['reason'].includes(commandName))
      return command.execute({
        client,
        message,
        args,
        commands,
        commandHandlerStarted: timeStarted,
      });
    else return false;
  }
  for (let prefix of PREFIXES) handleCommand(prefix, prefix === '!');
  return true;
};
