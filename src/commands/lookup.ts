import {
  Context,
  CommandMetadata,
  WidgetResponse,
  GuildLookupData,
} from '../types';
import { SnowflakeUtil, MessageEmbed, GuildPreview } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import axios from 'axios';

export const execute = async (ctx: Context): Promise<boolean> => {
  const deconstructed = SnowflakeUtil.deconstruct(
      ctx.args[0] ?? ctx.message.author.id
    ),
    user = await ctx.client.users.fetch(ctx.args[0]).catch(e => null),
    invite = await ctx.client
      .fetchInvite(
        ctx.args[0].replace(/(https?:\/\/)?discord\.(gg|com\/invites)\//g, '')
      )
      .catch(e => null),
    guild: GuildLookupData =
      (await ctx.client.fetchGuildPreview(ctx.args[0]).catch(e => null)) ??
      ((
        await axios.get(
          `https://canary.discord.com/api/guilds/${ctx.args[0]}/widget.json`
        ).catch(() => null)
      )?.data as WidgetResponse);
  const _ = new MessageEmbed()
    .setColor(CLIENT_COLOUR)
    .setAuthor(`Lookup Information for ${ctx.args[0]}`)
    .setFooter(
      `Requested by ${ctx.message.author.tag} (${ctx.message.author.id})${
        parseInt(ctx.args[0]) ? ' | Snowflake created at' : ''
      }`
    )
    .setTimestamp(parseInt(ctx.args[0]) ? deconstructed.timestamp : Date.now())
    .setThumbnail(ctx.client.user?.avatarURL() as string);
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
              }${invite.guild?.name}\n⇒ __Vanity__: \`${
                invite.guild?.vanityURLCode ?? 'None'
              }\`${
                invite.guild?.approximateMemberCount || invite.memberCount
                  ? `\n⇒ __Member Count__: ${invite.guild?.approximateMemberCount ?? invite.memberCount}`
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
      .setTimestamp(invite.guild?.createdTimestamp);
  }
  if (guild) {
    let g = guild as GuildPreview & { members?: any[] };
    _.setAuthor(`Guild Lookup for ${g.name}`)
      .addField(
        'Guild Info',
        `**Name**: ${g.name}\n**ID**: ${g.id}\n**Members**: ${
          g.approximateMemberCount ?? g.members?.length
        }\n${g.description ? `**Description**: ${g.description}\n` : ''}${
          g.features
            ? `**Community Features**: ${g.features.map(v => `\`${v}\``).join(", ")}`
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
      Object.entries(deconstructed).map(
        ([K, V]) =>
          `**${K.replace(/\b\w/g, v => v.toUpperCase()).replace(
            /([a-z])([A-Z])/g,
            '$1 $2'
          )}**: \`${
            (V as Date | string | number) instanceof Date
              ? V.toLocaleString()
              : V
          }\``
      )
    );

  if (_.fields.length === 0)
    _.setDescription(
      'Nothing was found... I currently only support **user IDs** and **server invite links**.'
    ).setImage(
      'https://cdn.dribbble.com/users/623808/screenshots/4012628/1-safe.jpg'
    );
  
  ctx.message.reply({
    allowedMentions: { repliedUser: false, parse: [] },
    embed: _,
  });
  return true;
};

export const meta: CommandMetadata = {
  name: 'lookup',
  description: 'Looks up an ID in Discord.',
  accessLevel: 0,
  aliases: [],
};
