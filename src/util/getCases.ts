import { Snowflake, Collection, GuildAuditLogsEntry } from "discord.js";

export const getCases = (entries: Collection<Snowflake, GuildAuditLogsEntry>) => entries.filter(entry => ["MEMBER_BAN_ADD", "MEMBER_BAN_REMOVE"].includes(entry?.action)).size
