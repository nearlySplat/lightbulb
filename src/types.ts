/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import {
  APIApplicationCommandInteractionDataOptionWithValues,
  APIApplicationCommandOption,
  APIEmbed,
  APIGuildMember,
  APIMessage,
  APIUser,
  ApplicationCommandInteractionDataOptionSubCommand,
  ApplicationCommandInteractionDataOptionSubCommandGroup,
} from 'discord-api-types';
import {
  Channel,
  Client,
  Collection,
  Guild,
  GuildMember,
  GuildPreview,
  Message,
  MessageEmbed,
  MessageOptions,
  PermissionFlags,
  Snowflake,
  User,
} from 'discord.js';
import { CommandParameters, Parameter } from './util';

export type Command = {
  execute: CommandExecute;
  meta: CommandMetadata;
};

export type CommandExecute<T extends string = string> = (
  context: Context<T>
) => Awaited<boolean | CommandResponse>;
export declare type Awaited<T> = T | Promise<T>;
export interface ExtendedMessageOptions extends MessageOptions {
  embed?: MessageEmbed;
}
export type CommandResponse =
  | [options: ExtendedMessageOptions, handler: ButtonInteractionHandler]
  | readonly [
      options: ExtendedMessageOptions,
      handler: ButtonInteractionHandler
    ];
export type ButtonInteractionHandler = (
  context: ButtonInteractionHandlerContext
) => Awaited<SlashCommandResponse>;

export interface ButtonInteractionHandlerContext {
  user: User;
  channel: Channel;
  message: Message;
  client: Client;
  guild?: Guild;
  interaction: MessageComponentInteraction;
  customID: string;
  removeListener(): boolean;
}

export interface Context<T extends string = string> {
  client: Client;
  args: CommandParameters<T>;
  message: Message & { guild: Guild; member: GuildMember };
  commands: Collection<string, Command>;
  commandHandlerStarted: number;
  accessLevel: number;
  locale: 'uwu' | 'en_UK';
  commandName: string;
  deleteButtonHandler: ButtonInteractionHandler;
}

export interface CommandMetadata {
  name: string;
  description: string;
  aliases: string[];
  userPermissions?: (keyof PermissionFlags)[] | bigint[];
  accessLevel: keyof IAccessLevels | 0 | 1 | 2 | 3;
  hidden?: boolean;
  scope?: 'guild' | 'dm' | 'slashMutualGuild' | 'any';
  params?: Parameter[];
}

export interface IAccessLevels {
  USER?: 0;
  MODERATOR?: 1;
  ADMINISTRATOR?: 2;
  OWNER?: 3;
}

export type WidgetResponse = WidgetSuccessfulResponse | WidgetError;

export type WidgetError =
  | {
      [value: string]: string[];
    }
  | { message: string; code: number };

export interface WidgetSuccessfulResponse {
  id?: Snowflake;
  name?: string;
  instant_invite?: string;
  members?: APIGuildMember[];
  presence_count?: number;
}

export type GuildLookupData = WidgetResponse | GuildPreview | null;
export interface SlashCommand {
  execute: SlashCommandExecute;
  meta: CommandMetadata;
}

export type SlashCommandExecute = (
  context: SlashCommandContext
) => SlashCommandResponse;

export interface SlashCommandContext {
  client: Client;
  interactionHandlerStarted: number;
  member: GuildMember | null;
  author: User;
  guild: Guild | null;
  interaction: Interaction;
  subcommand: ApplicationCommandInteractionDataOptionSubCommand | null;
  getOption(
    name: string
  ): Exclude<
    APIApplicationCommandInteractionDataOptionWithValues,
    | ApplicationCommandInteractionDataOptionSubCommand
    | ApplicationCommandInteractionDataOptionSubCommandGroup
  >;
}
export interface Interaction {
  data: {
    name: string;
    id: Snowflake;
    options?: APIApplicationCommandOption[];
  };
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  member?: APIGuildMember | GuildMember | null;
  id: Snowflake;
  user?: APIUser | User | null;
  token: string;
}
export type MessageComponentInteraction = IMessageComponentInteraction &
  Partial<IMessageComponentSelectMenuInteraction>;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface IMessageComponentInteraction extends Interaction {
  message: APIMessage;
  data: {
    component_type: Exclude<
      // eslint-disable-next-line no-undef
      MessageComponentTypes,
      // eslint-disable-next-line no-undef
      MessageComponentTypes.ACTION_ROW
    >;
    custom_id: string;
  };
}
export interface IMessageComponentSelectMenuInteraction
  extends IMessageComponentInteraction {
  data: {
    component_type: Exclude<
      // eslint-disable-next-line no-undef
      MessageComponentTypes,
      // eslint-disable-next-line no-undef
      MessageComponentTypes.ACTION_ROW
    >;
    values: string[];
    custom_id: string;
  };
}
export type SlashCommandResponse = {
  type: 1 | 4 | 5 | 6 | 7;
  data?: {
    content?: string;
    embeds?: (APIEmbed | MessageEmbed)[];
    flags?: 64;
  };
};

export interface YAMLConfig {
  owner: Owner;
  bot: Bot;
  whitelist: null | string[];
  nodb: boolean;
}

export interface Owner {
  name: string;
  markov: MarkovConfig;
  id: Snowflake;
}

export interface MarkovConfig {
  trigger: string;
  suffix: string;
  name: string;
  file: string | null;
}

export interface Bot {
  prefix: string[] | string;
  name: string;
  support_server: Snowflake;
}

export enum InteractionTypes {
  PING = 1,
  APPLICATION_COMMAND,
  MESSAGE_COMPONENT,
}

interface RequestOptions {
  query?: URLSearchParams | Record<string, string | string[]>;
  versioned?: boolean;
  auth?: boolean;
  reason?: string;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  files?: unknown[];
}

type HttpMethod = 'get' | 'post' | 'delete' | 'patch' | 'put';

export type RouteBuilder = Record<
  HttpMethod,
  <T>(options?: RequestOptions) => Promise<T>
> &
  {
    [k in string]: RouteBuilder;
  } &
  ((...args: string[]) => RouteBuilder);
