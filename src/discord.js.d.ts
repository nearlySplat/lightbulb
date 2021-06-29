import { RouteBuilder } from './types.js';

declare module 'discord.js' {
  export interface Client {
    api: RouteBuilder;
  }
  export interface APIMessage {
    data: Record<string, unknown>;
  }
  export type Snowflake = string;
  export type StringResolvable = string;
}

declare module 'discord-api-types' {
  export type Snowflake = string;
}
