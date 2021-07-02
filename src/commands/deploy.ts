import { CommandExecute, CommandMetadata } from '../types';
import { sleep } from '../util/';
import { WHITELIST } from '../constants';
import { MessageActionRow, MessageButton } from 'discord.js';
import { buttonHandlers } from '../events/message';
import path from "path";
const nerrix = '332864061496623104';
export const meta: CommandMetadata = {
  name: 'deploy',
  description: 'Deploys obama.',
  aliases: ['obama'],
  accessLevel: 0,
};

export const execute: CommandExecute = async ctx => {
  const nerrix = ctx.message.author.id;
  async function confirm(): Promise<true | void> {
    const msg = await ctx.message.channel.send({
      content: `<@${nerrix}>, ${ctx.message.author.username} wants to deploy Obama. Authorize?`,
      allowedMentions: { users: [nerrix] },
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel('Authorize')
            .setCustomID('a')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setLabel('Decline')
            .setCustomID('d')
            .setStyle('DANGER')
        ),
      ],
    });
    const accepted = await new Promise(r => {
      const coll = msg.createMessageComponentInteractionCollector({
        filter: v => v.user.id === nerrix,
      });
      coll.on('collect', async interaction => {
        coll.stop();
        await interaction.reply({ content: "Obama has been deployed.", attachments: ['1.png', '2.jpeg', '3.jpeg', 'final.png'].map(v => path.resolve(__dirname, '..', '..', 'assets', 'obama', v))});
        await msg.edit({ components: [], content: "Deployment has been authorized." });
        if (interaction.customID === 'a') r(true);
        else r(false);
      });
    });
    return accepted;
  }
  function deploy() {
    ctx.message.reply('Deployed');
  }
  const authorizedUsers = [...WHITELIST, nerrix];
  if (!authorizedUsers.includes(ctx.message.author.id))
    return [
      { content: 'You are not authorized to execute this action!' },
      null,
    ];
  if (ctx.message.author.id !== nerrix) deploy();
  else confirm();
};
