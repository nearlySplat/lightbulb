import { MessageEmbed } from 'discord.js';
import { CLIENT_COLOUR } from '../constants';
import { CommandMetadata, CommandExecute } from '../types';
import { getMember, i18n } from '../util';

export const meta: CommandMetadata = {
  name: 'avatar',
  description: 'command name',
  aliases: ['av', 'avy'],
  accessLevel: 0,
  params: [{ name: 'user', type: 'string' }],
};

export const execute: CommandExecute = async ctx => {
  const target = getMember(ctx.message.guild, ctx.args.data.user).user;
  if (!target) return [{ content: 'No target.' }, null];
  return [
    {
      embed: new MessageEmbed()
        .setAuthor(`${target.tag}'s Avatar`)
        .setColor(ctx.message.guild.me.roles.color.color || CLIENT_COLOUR)
        .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setTimestamp()
        .setFooter(
          i18n.interpolate(i18n.get('GENERIC_REQUESTED_BY', ctx.locale), {
            requester: `${ctx.message.author.tag} (${ctx.message.author.id})`,
          })
        ),
    },
    null,
  ];
};
