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
import { MessageActionRow, MessageButton, MessageOptions } from 'discord.js';
import {
  Client,
  ClientUser,
  Collection,
  Guild,
  GuildMember,
  Message,
  Snowflake,
} from 'discord.js';
import { commands, loggr } from '..';
import { config, PREFIXES } from '../constants';
import { ButtonInteractionHandler, Command, CommandResponse } from '../types';
import {
  CommandParameters,
  getAccessLevel,
  getCurrentLevel,
  i18n,
} from '../util';
import { tags } from '../util/tags';
export const buttonHandlers = new Collection<
  Snowflake,
  ButtonInteractionHandler
>();
export const defaultDeleteButton = [
  new MessageActionRow({
    components: [
      new MessageButton()
        .setEmoji('cutie_trash:848216792845516861')
        .setStyle('DANGER')
        .setCustomID('internal__delete')
        .setLabel(''),
    ],
  }),
];
let bls: Snowflake[] = [];
export async function reloadBlacklists(client: Client) {
  const bans = await client.guilds.cache
    .get(config.bot.support_server)
    .bans.fetch();
  const newArr = bans.map(v => v.user.id);
  loggr.info(
    'Successfully reloaded blacklists for guild',
    config.bot.support_server,
    'with',
    newArr.map(v => !bls.includes(v)).length,
    'new users and',
    bls.map(v => !newArr.includes(v)).length,
    'unblacklisted.'
  );
  return bls;
}
export const execute = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  const deleteButtonHandler: ButtonInteractionHandler = async ctx => {
    if (ctx.user.id === message.author.id) await ctx.message.delete();
    else
      return {
        type: 4,
        data: { content: "You can't do that!", flags: 64 },
      };
    return { type: 6 };
  };
  async function handleCommandResult(result: CommandResponse) {
    let [options, handler] = result;
    // @ts-ignore
    if (options.embeds || options.embed) {
      // @ts-ignore
      options.embeds = [options.embed];
    }
    if (!options.components) {
      options.components = defaultDeleteButton;
      handler = deleteButtonHandler;
    }
    const msg = (await message.channel.send(
      options as MessageOptions & { split: false }
    )) as Message;
    buttonHandlers.set(msg.id, handler);
  }
  if (!message.guild || !message.member) return false;
  const isKsIn = !!(await message
    .guild!.members.fetch('236726289665490944')
    .catch(() => null));
  async function handleCommand(
    prefix: string,
    isExclamation = false
  ): Promise<boolean> {
    const timeStarted = Date.now();
    if (!message.content.startsWith(prefix)) return false;
    if (bls.includes(message.author.id)) {
      message.channel.send(
        'You cannot access this bot since you are blacklisted.'
      );
      return false;
    }
    let args: string[] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);
    const command: Command | undefined =
        commands.get(args[0]) ||
        commands.find(
          value =>
            (value && value.meta && value.meta.aliases.includes(args[0])) ||
            false
        ),
      commandName = args[0];
    if (!command) {
      if (tags.has(commandName) || tags.has(args.join(' '))) {
        let result = tags.get(args.join(' ')) || tags.get(commandName);
        if (Array.isArray(result))
          result = result[Math.floor(Math.random() * result.length)];
        result = i18n.interpolate(result, { args0: args[0] });
        handleCommandResult([{ content: result }, null]);
        return true;
      } else return false;
    }
    args = args.slice(1);
    if (
      command.meta.accessLevel &&
      getCurrentLevel(message.member as GuildMember) <
        getAccessLevel(command.meta.accessLevel as 0 | 1 | 2 | 3)
    )
      return false;
    let paramInstance;
    try {
      paramInstance = await CommandParameters.from(command.meta, args);
    } catch (e) {
      CommandParameters.triggerError(
        r => handleCommandResult([{ content: r }, null]),
        e
      );
      return false;
    }
    if ((isExclamation && ['reason'].includes(commandName)) || !isExclamation) {
      let result: CommandResponse | boolean;
      try {
        result = await command.execute({
          client,
          message: message as Message & { member: GuildMember; guild: Guild },
          args: paramInstance,
          commands,
          commandHandlerStarted: timeStarted,
          accessLevel: getCurrentLevel(message.member as GuildMember),
          locale: 'en_UK',
          commandName,
          deleteButtonHandler,
        });
      } catch (e) {
        handleCommandResult([
          { content: `\`\`\`js\n${e.toString()}\n\`\`\`` },
          null,
        ]);
      }
      if (typeof result === 'boolean') return result;
      handleCommandResult(result);
    } else return false;
  }
  for (const prefix of [
    `<@${(client.user as ClientUser).id}>`,
    `<@!${client.user!.id}>`,
    ...PREFIXES,
  ].filter(v => v !== 'pls' || !isKsIn))
    handleCommand(prefix, prefix === '!');
  return true;
};
