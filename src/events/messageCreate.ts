/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { commands, loggr, statcord } from '..';
import { config, PREFIXES, WHITELIST } from '../constants';
import { User, Achievement, DefaultPronouns } from '../models/User';
import { GuildConfig, IGuildConfig } from '../models/GuildConfig';
import { ButtonInteractionHandler, Command, CommandResponse } from '../types';
import {
  CommandParameters,
  getAccessLevel,
  getCurrentLevel,
  i18n,
} from '../util';
import { tags } from '../util/tags';
import { Document as MongoDBDocument } from 'mongoose';
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
        .setCustomId('internal__delete')
        .setLabel(''),
    ],
  }),
];
const bls: Snowflake[] = [];
export const guildConfigCache = new Map<
  Snowflake,
  IGuildConfig & MongoDBDocument<any, any, IGuildConfig>
>();
export function updateGuildConfigCache(
  data: IGuildConfig & MongoDBDocument<any, any, IGuildConfig>
): typeof guildConfigCache {
  return guildConfigCache.set(data.gid, data);
}
export async function reloadBlacklists(client: Client): Promise<Snowflake[]> {
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
    if (!result[Symbol.iterator]) return false;
    let [, handler] = result;
    const [options] = result;
    if (options.embeds || options.embed) {
      options.embeds = [options.embed];
    }
    if (!options.components) {
      options.components = defaultDeleteButton;
      handler = deleteButtonHandler;
    }
    if (options.code) {
      options.content = `\`\`\`${options.code === true ? '' : options.code}\n${
        options.content
      }\n\`\`\``;
    }
    const msg = (await message.reply(
      options as MessageOptions & { split: false }
    )) as Message;
    buttonHandlers.set(msg.id, handler);
    return true;
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
        "You cannot access this bot's commands since you are blacklisted."
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
    const info =
      (await User.findOne({
        uid: message.author.id,
      }).exec()) || new User();
    if (!info.commands.includes(commandName)) info.commands.push(commandName);
    if (info.commands.length === 1)
      info.achievements.push(Achievement.FirstCommand);
    if (!info.pronouns) info.pronouns = DefaultPronouns;
    if (info.isDeveloper === undefined || info.isDeveloper === null)
      info.isDeveloper = WHITELIST.includes(message.author.id);
    info.uid = message.author.id;
    await info.save();
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
        r => (handleCommandResult([{ content: r }, null]), void 0),
        e
      );
      return false;
    }
    statcord.postCommand(commandName, message.author.id);
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
        return false;
      }
      if (typeof result === 'boolean') return result;
      handleCommandResult(result);
      return true;
    } else return false;
  }
  let guildInfo: IGuildConfig & MongoDBDocument<any, any, IGuildConfig>;
  if (guildConfigCache.has(message.guild.id))
    guildInfo = guildConfigCache.get(message.guild.id);
  else guildInfo = await GuildConfig.findOne({ gid: message.guild.id }).exec();
  if (!guildInfo) {
    guildInfo = new GuildConfig();
    guildInfo.gid = message.guild.id;
    await guildInfo.save();
    updateGuildConfigCache(guildInfo);
  }
  for (const prefix of [
    `<@${(client.user as ClientUser).id}>`,
    `<@!${client.user!.id}>`,
    ...PREFIXES,
    ...guildInfo.prefixes.map(v => v.value),
  ].filter(v => v !== 'pls' || !isKsIn)) {
    handleCommand(prefix, prefix === '!');
    if (
      message.content === 'thanks' &&
      message.channel.messages.cache
        .filter(v => v.author.id === message.author.id)
        .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        .array()[1]
        .content.startsWith(prefix)
    ) {
      message.channel.send('ur welcome');
    }
  }
  return true;
};