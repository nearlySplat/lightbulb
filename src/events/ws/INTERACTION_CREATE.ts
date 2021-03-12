import { Client, Snowflake, MessageEmbed, User, GuildMember } from 'discord.js';
import { Interaction, SlashCommand, SlashCommandResponse } from '../../types';
import { slashCommands, loggr } from '../..';
import commandFuncs from '../../util/commandfuncs';

export const execute = async (client: Client, interaction: Interaction) => {
  loggr.debug(interaction, interaction.data.options);
  function respond(data: { data: SlashCommandResponse }) {
    // @ts-ignore
    return client.api
      .interactions(interaction.id, interaction.token)
      .callback.post(data);
  }
  const interactionHandlerStarted = Date.now();
  if (slashCommands.has(interaction.data.name)) {
    const author = (await client.users
      .fetch(
        (interaction.member?.user.id ??
          (!interaction.guild_id ? interaction.user!.id : '0')) as Snowflake,
        true
      )
      .catch(() => null)) as User;
    const guild =
      client.guilds.cache.get(interaction.guild_id as string) ?? null;
    const member = guild
      ? await guild!.members.fetch(author?.id ?? '').catch(() => {})
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
                  `You need to use this slash command in a server I'm physically in! To invite me, use [this link](https://discord.com/oauth2/authorize?client_id=${
                    client.user!.id
                  }&scope=bot+applications.commands).`
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
      data: slashCommands.get(interaction.data.name)!.execute({
        client,
        interactionHandlerStarted,
        guild,
        member: member as GuildMember | null,
        author,
        interaction,
        commandFuncs,
      }),
    });
  }
};
