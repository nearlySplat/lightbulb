import { Client, GuildMember, Message, ClientUser, Guild } from 'discord.js';
import { commands, slashCommands } from '..';
import { PREFIXES } from '../constants';
import { Command, SlashCommandContext } from '../types';
import { CommandParameters, getAccessLevel, getCurrentLevel } from '../util';

export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  if (!message.guild || !message.member) return false;
  const isKsIn = !!(await message
    .guild!.members.fetch('236726289665490944')
    .catch(() => null));
  // console.log(isKsIn)
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
        const output = slashCommands.get(commandName)!.execute({
          interactionHandlerStarted: timeStarted,
          member: message.member,
          author: message.author,
          guild: message.guild,
          client: message.client,
          interaction: {
            member: {
              ...(message.member ?? {}),
              is_pending: !!message.member?.pending,
              joined_at: message.member?.joinedAt?.toString() ?? '',
            },
            channel_id: message.channel.id,
            guild_id: message.guild!.id,
            user: message.guild ? null : message.author,
            token: 'NormalMessage0',
            id: message.id,
            data: { name: commandName, id: '0' },
          },
          commandFuncs: {} as SlashCommandContext['commandFuncs'],
        });
        if (output)
          client.api.channels[message.channel.id].messages.post(output.data);
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
      paramInstance = await CommandParameters.from<string>(command.meta, args);
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
