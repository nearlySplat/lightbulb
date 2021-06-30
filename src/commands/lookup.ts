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
import axios from 'axios';
import {
  GuildPreview,
  MessageEmbed,
  Snowflake,
  SnowflakeUtil,
} from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import {
  CommandExecute,
  CommandMetadata,
  GuildLookupData,
  WidgetResponse,
} from '../types';
import { APIGuildMember } from 'discord-api-types';
export const execute: CommandExecute = async ctx => {
  const deconstructed = SnowflakeUtil.deconstruct(
      (ctx.args[0] || ctx.message.author.id) as Snowflake
    ),
    user = await ctx.client.users
      .fetch(ctx.args[0] as Snowflake)
      .catch(() => null),
    invite = await ctx.client
      .fetchInvite(
        ctx.args[0].replace(/(https?:\/\/)?discord\.(gg|com\/invites)\//g, '')
      )
      .catch(() => null),
    guild: GuildLookupData =
      (await ctx.client
        .fetchGuildPreview(ctx.args[0] as Snowflake)
        .catch(() => null)) ||
      ((
        (await axios
          .get(
            `https://canary.discord.com/api/guilds/${ctx.args[0]}/widget.json`
          )
          .catch(() => null)) || {}
      ).data as WidgetResponse);
  const _ = new MessageEmbed()
    .setColor(CLIENT_COLOUR)
    .setAuthor(`Lookup Information for ${ctx.args[0]}`)
    .setFooter(
      `Requested by ${ctx.message.author.tag} (${ctx.message.author.id})${
        parseInt(ctx.args[0]) ? ' | Snowflake created at' : ''
      }`
    )
    .setTimestamp(parseInt(ctx.args[0]) ? deconstructed.timestamp : Date.now())
    .setThumbnail(ctx.client.user!.avatarURL() as string);
  if (user) {
    _.setAuthor(`Lookup for ${user.tag}`)
      .addField('User Info', `**Tag**: ${user.tag}\n**ID**: ${user.id}`)
      .setThumbnail(
        user.avatarURL({
          dynamic: true,
        }) as string
      );
  } else if (invite) {
    _.setAuthor(`Invite Lookup for ${invite.guild?.name ?? invite.code}`)
      .addField(
        'Invite Info',
        `**Invite Link**: https://discord.gg/${invite.code}${
          invite.inviter
            ? `\n**Inviter**: __${invite.inviter.tag}__ (${invite.inviter.id})`
            : ''
        }\n${
          invite.guild
            ? `**Guild**:\n⇒ __Name__: ${
                invite.guild.verified
                  ? '<:verified_server:811324798616862771> '
                  : ''
              }${invite.guild.name}\n⇒ __Vanity__: \`${
                invite.guild.vanityURLCode || 'None'
              }\`${
                invite.guild.approximateMemberCount || invite.memberCount
                  ? `\n⇒ __Member Count__: ${
                      invite.guild.approximateMemberCount || invite.memberCount
                    }`
                  : ''
              }`
            : ''
        }`
      )
      .setImage(
        (invite.guild?.bannerURL({
          size: 512,
        }) ??
          invite.guild?.splashURL({
            size: 512,
          })) as string
      )
      .setThumbnail(
        invite.guild?.iconURL({
          dynamic: true,
        }) as string
      )
      .setFooter(
        `Requested by ${ctx.message.author.tag} (${ctx.message.author.id}) | ${
          invite.guild ? 'Server' : 'Snowflake'
        } created`
      )
      .setTimestamp(invite.guild ? invite.guild.createdTimestamp : undefined);
  }
  if (guild) {
    const g = guild as GuildPreview & { members?: APIGuildMember[] };
    _.setAuthor(`Guild Lookup for ${g.name}`)
      .addField(
        'Guild Info',
        `**Name**: ${g.name}\n**ID**: ${g.id}\n**Members**: ${
          g.approximateMemberCount ?? g.members?.length
        }\n${g.description ? `**Description**: ${g.description}\n` : ''}${
          g.features
            ? `**Community Features**: ${g.features
                .map(v => `\`${v}\``)
                .join(', ')}`
            : ''
        }`
      )
      .setThumbnail(
        g.iconURL?.({
          dynamic: true,
        }) as string
      );
  }
  if (parseInt(ctx.args[0]))
    _.addField(
      'Snowflake',
      Object.entries(deconstructed)
        .map(
          ([K, V]) =>
            `**${K.replace(/\b\w/g, v => v.toUpperCase()).replace(
              /([a-z])([A-Z])/g,
              '$1 $2'
            )}**: ${
              (V as Date | string | number) instanceof Date
                ? `<t:${Math.floor(V.getTime() / 1000)}>`
                : `\`${V}\``
            }`
        )
        .join('\n')
    );

  if (_.fields.length === 0)
    _.setDescription(
      'Nothing was found... I currently only support **Discord Snowflakes** and **server invite links**.'
    ).setImage(
      'https://cdn.dribbble.com/users/623808/screenshots/4012628/1-safe.jpg'
    );

  return [
    {
      embed: _,
    },
    null,
  ];
};

export const meta: CommandMetadata = {
  name: 'lookup',
  description: 'Looks up an ID in Discord.',
  accessLevel: 0,
  aliases: [],
  params: [
    {
      name: 'thing',
      type: 'string',
      rest: true,
      optional: false,
    },
  ],
};
