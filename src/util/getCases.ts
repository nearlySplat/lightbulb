import { Snowflake, Collection } from "discord.js";

export const getCases = (entries: Collection<Snowflake, unknown>) => entries.filter(entry => ["MEMBER_BAN_ADD", "MEMBER_BAN_REMOVE"].includes(entry?.action)).size
