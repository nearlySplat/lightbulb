/*
 * Copyright (C) 2020 Splaterxl
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
  Client,
  Collection,
  Guild,
  GuildMember,
  GuildPreview,
  Message,
  PermissionFlags,
  Snowflake,
  StringResolvable,
  MessageEmbed,
  User,
} from 'discord.js';
import { CommandParameters, Parameter } from './util';

export type Command = {
  execute: CommandExecute;
  meta: CommandMetadata;
};

export type CommandExecute<T extends string = string> = (
  context: Context<T>
) => boolean | Promise<boolean>;

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
  commandFuncs: RecurringAnyFuncOrObj;
}
export interface Interaction {
  data: {
    name: string;
    id: Snowflake;
    options?: any[];
  };
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  member?: Record<string, any> | GuildMember | null;
  id: Snowflake;
  user?: Record<string, any> | User | null;
  token: string;
}

export type SlashCommandResponse = {
  type: 1 | 4 | 5;
  data: {
    content?: StringResolvable;
    embeds?: (Record<string, any> | MessageEmbed)[];
    flags?: 64;
  };
};
