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
  APIGuildMember,
  APIPartialEmoji,
  APIUser,
  APIMessage,
} from 'discord-api-types';
import {
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
) => PromiseLike<boolean | CommandResponse>;

export type CommandResponse = [
  options: BetterMessageOptions,
  handler: (options: any) => SlashCommandResponse
];
export interface BetterMessageOptions extends MessageOptions {
  components?: ActionRowComponent[];
}
export enum ComponentType {
  ActionRow = 1,
  Button,
}

export enum ComponentStyle {
  Primary = 1,
  Secondary,
  Success,
  Danger,
  Link,
}

export interface BaseComponent {
  type: ComponentType;
}
export interface ActionRowComponent extends BaseComponent {
  type: ComponentType.ActionRow;
  components: ButtonComponent[];
}
export interface ButtonComponent extends BaseComponent {
  type: ComponentType.Button;
  style: ComponentStyle;
  label: string;
  custom_id: string;
  emoji?: APIPartialEmoji;
  url?: string;
  disabled?: boolean;
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
}

export interface CommandMetadata {
  name: string;
  description: string;
  aliases: string[];
  userPermissions?: (keyof PermissionFlags)[] | bigint[];
  accessLevel: keyof AccessLevels | 0 | 1 | 2 | 3;
  hidden?: boolean;
  scope?: 'guild' | 'dm' | 'slashMutualGuild' | 'any';
  params?: Parameter[];
}

export interface AccessLevels {
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
  members?: any[];
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
export type RecurringAnyFuncOrObj = Record<string, any> &
  (<T>(...args: any[]) => T) &
  { [key in string]: RecurringAnyFuncOrObj };

export interface SlashCommandContext {
  client: Client;
  interactionHandlerStarted: number;
  member: GuildMember | null;
  author: User;
  guild: Guild | null;
  interaction: Interaction;
}
export interface Interaction {
  data: {
    name: string;
    id: Snowflake;
    options?: any[];
  };
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  member?: APIGuildMember | GuildMember | null;
  id: Snowflake;
  user?: APIUser | User | null;
  token: string;
}
// @ts-ignore
export interface MessageComponentInteraction extends Interaction {
  message: APIMessage;
  data: {
    component_type: Exclude<ComponentType, ComponentType.ActionRow>;
    custom_id: string;
  };
}
export type SlashCommandResponse = {
  type: 1 | 4 | 5;
  data: {
    content?: string;
    embeds?: (Record<string, any> | MessageEmbed)[];
    flags?: 64;
  };
};

export interface YAMLConfig {
  owner: Owner;
  bot: Bot;
  whitelist: null | string[];
}

export interface Owner {
  name: string;
  markov: MarkovConfig;
  id: string;
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

declare module 'discord.js' {
  // @ts-ignore
  export interface Client {
    api: RouteBuilder;
  }
  export interface APIMessage {
    // @ts-ignore
    data: Record<string, unknown>;
  }
}
