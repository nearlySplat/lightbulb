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
import { GatewayInteractionCreateDispatchData } from 'discord-api-types';
import {
  Client,
  GuildMember,
  MessageEmbed,
  Snowflake,
  TextChannel,
  User,
} from 'discord.js';
import { slashCommands } from '../..';
import {
  Interaction,
  InteractionTypes,
  MessageComponentInteraction,
  SlashCommand,
  SlashCommandResponse,
} from '../../types';
import { buttonHandlers } from '../message';
import { i18n, sleep } from '../../util';

export const execute = async (
  client: Client,
  interaction: GatewayInteractionCreateDispatchData
) => {
  if (
    (interaction.type as unknown as InteractionTypes) ===
    InteractionTypes.APPLICATION_COMMAND
  )
    return slashCommandExecute(client, interaction);
  else if (
    (interaction.type as unknown as InteractionTypes) ===
    InteractionTypes.MESSAGE_COMPONENT
  ) {
    buttonExecute(
      client,
      interaction as unknown as MessageComponentInteraction
    );
  }
};

export const slashCommandExecute = async (
  client: Client,
  interaction: Interaction
) => {
  function respond(data: { data: SlashCommandResponse }) {
    return client.api
      .interactions(interaction.id, interaction.token)
      .callback.post(data);
  }
  const interactionHandlerStarted = Date.now();
  if (slashCommands.has(interaction.data.name)) {
    const author = (await client.users
      .fetch(
        ((interaction.member || { user: { id: '' } }).user.id ||
          (!interaction.guild_id ? interaction.user.id : '0')) as Snowflake,
        true
      )
      .catch(() => null)) as User;
    const guild =
      client.guilds.cache.get(interaction.guild_id as Snowflake) || null;
    const member = guild
      ? await guild.members
          .fetch(author.id || ('' as Snowflake))
          .catch(() => {})
      : null;
    const command = slashCommands.get(interaction.data.name) as SlashCommand;
    if (!guild && command.meta.scope === 'slashMutualGuild')
      return respond({
        data: {
          type: 4,
          data: {
            embeds: [
              new MessageEmbed()
                .setColor('RED')
                .setTitle('Invalid Scope')
                .setDescription(
                  `You need to use this slash command in a server I'm physically in! To invite me, use [this link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands).`
                ),
            ],
          },
        },
      });
    else if (member && command.meta.scope === 'dm')
      return respond({
        data: {
          type: 4,
          data: {
            embeds: [
              new MessageEmbed()
                .setColor('RED')
                .setTitle('Invalid Scope')
                .setDescription(
                  'You need to use this slash command in a DM to me!'
                ),
            ],
          },
        },
      });
    return respond({
      data: slashCommands.get(interaction.data.name).execute({
        client,
        interactionHandlerStarted,
        guild,
        member: member as GuildMember | null,
        author,
        interaction,
      }),
    });
  }
};

export const buttonExecute = async (
  client: Client,
  interaction: MessageComponentInteraction
) => {
  function respond(data: { data: SlashCommandResponse }) {
    return client.api
      .interactions(interaction.id, interaction.token)
      .callback.post(data);
  }
  const channel = (await client.channels.fetch(
    interaction.message.channel_id
  )) as TextChannel;
  const message = await channel.messages.fetch(interaction.message.id);
  if (buttonHandlers.has(message.id)) {
    const handler = buttonHandlers.get(message.id);
    const user = await client.users.fetch(
      (interaction.user || {}).id || interaction.member.user.id
    );
    const guild = client.guilds.cache.get(interaction.guild_id);
    await respond({
      data: await handler({
        user,
        channel,
        message,
        guild,
        client,
        interaction,
      }),
    });
  } else {
  }
};
