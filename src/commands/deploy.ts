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
import { CommandExecute, CommandMetadata } from '../types';
import { WHITELIST } from '../constants';
import { MessageActionRow, MessageButton } from 'discord.js';
import path from 'path';

const nerrix = '332864061496623104';
export const meta: CommandMetadata = {
  name: 'deploy',
  description: 'Deploys obama.',
  aliases: ['obama'],
  accessLevel: 0,
};

export const execute: CommandExecute = async ctx => {
  async function confirm(): Promise<boolean> {
    const msg = await ctx.message.channel.send({
      content: `<@${nerrix}>, ${ctx.message.author.username} wants to deploy Obama. Authorize?`,
      allowedMentions: { users: [nerrix] },
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel('Authorize')
            .setCustomId('a')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setLabel('Decline')
            .setCustomId('d')
            .setStyle('DANGER')
        ),
      ],
    });
    const accepted = await new Promise<boolean>(r => {
      const coll = msg.createMessageComponentCollector({
        filter: v => v.user.id === nerrix,
      });
      coll.on('collect', async interaction => {
        coll.stop();
        if (interaction.customId === 'a')
          await interaction.reply({
            content: 'Obama has been deployed.',
            files: ['1.png', '2.jpeg', '3.jpeg', 'final.png'].map(v =>
              // eslint-disable-next-line no-undef
              path.resolve(__dirname, '..', '..', '..', 'assets', 'img', 'obama', v)
            ),
          });
        await msg.edit({
          components: [],
          content:
            'Deployment has ' +
            (interaction.customId === 'd' ? 'not ' : '') +
            'been authorized.',
        });
        if (interaction.customId === 'a') r(true);
        else r(false);
      });
    });
    return accepted;
  }
  function deploy() {
    ctx.message.reply({
      content: 'Deployed.',
      files: ['1.png', '2.jpeg', '3.jpeg', 'final.png'].map(v =>
        // eslint-disable-next-line no-undef
        path.resolve(__dirname, '..', '..', '..', 'assets', 'img', 'obama', v)
      ),
    });
  }
  const authorizedUsers = [...WHITELIST, nerrix];
  if (!authorizedUsers.includes(ctx.message.author.id))
    return [
      { content: 'You are not authorized to execute this action!' },
      null,
    ];
  if (ctx.message.author.id === nerrix) deploy();
  else confirm();
  return true;
};
