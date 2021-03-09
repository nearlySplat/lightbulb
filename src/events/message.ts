import { Client, GuildMember, Message, ClientUser, Guild } from 'discord.js';
import { commands, slashCommands } from '..';
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
      if (slashCommands.has(commandName)) {
        const output = slashCommands.get(commandName)!.execute({ interactionHandlerStarted: timeStarted, member: message.member, author: message.author, guild: message.guild, client: message.client, interaction: { member: { ...(message.member ?? {}), is_pending: !!message.member?.pending, joined_at: message.member?.joinedAt?.toString() } } })
      }
    };
    args = args.slice(1);
    if (
      command.meta?.accessLevel &&
      getCurrentLevel(message.member as GuildMember) <
        getAccessLevel(command.meta.accessLevel as 0 | 1 | 2 | 3)
    )
      return false;
    if ((isExclamation && ['reason'].includes(commandName)) || !isExclamation)
      return command.execute({
        client,
        message: message as Message & { member: GuildMember; guild: Guild },
        args,
        commands,
        commandHandlerStarted: timeStarted,
        accessLevel: getCurrentLevel(message.member as GuildMember),
        locale: message.author.id === '728342296696979526' ? 'h' : 'en_UK',
      });
    else return false;
  }
  for (const prefix of [
    `<@${(client.user as ClientUser).id}>`,
    `<@!${client.user!.id}>`,
    ...PREFIXES,
  ])
    handleCommand(prefix, prefix === '!');
  return true;
};

'a' || 'b';
