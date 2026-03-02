import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const advancement: Command = {
  data: new SlashCommandBuilder()
    .setName('advancement')
    .setDescription("Gérer les succès (advancements) d'un joueur")
    .addSubcommand((subcommand) =>
      subcommand
        .setName('revoke')
        .setDescription('Réinitialiser tout ou une partie des succès')
        .addStringOption((option) =>
          option
            .setName('joueur')
            .setDescription('Le pseudo du joueur')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('Type de réinitialisation')
            .setRequired(true)
            .addChoices(
              { name: 'Tout réinitialiser (Everything)', value: 'everything' },
              { name: 'Un succès spécifique (Only)', value: 'only' },
            ),
        )
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('L\'ID du succès (si "only" est sélectionné)')
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('grant')
        .setDescription('Donner tout ou une partie des succès')
        .addStringOption((option) =>
          option
            .setName('joueur')
            .setDescription('Le pseudo du joueur')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('Type de don')
            .setRequired(true)
            .addChoices(
              { name: 'Tout donner (Everything)', value: 'everything' },
              { name: 'Un succès spécifique (Only)', value: 'only' },
            ),
        )
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('L\'ID du succès (si "only" est sélectionné)')
            .setRequired(false),
        ),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const subcommand = interaction.options.getSubcommand();
    const joueur = interaction.options.getString('joueur', true);
    const type = interaction.options.getString('type', true);
    const id = interaction.options.getString('id');

    await interaction.deferReply();

    let mcCommand = `advancement ${subcommand} ${joueur} ${type}`;
    if (type === 'only') {
      if (!id) {
        await interaction.editReply(
          'Veuillez spécifier l\'ID du succès lorsque vous utilisez l\'option "only".',
        );
        return;
      }
      mcCommand += ` ${id}`;
    }

    try {
      const response = await rconService.execute(mcCommand);
      await interaction.editReply(
        `Succès de **${joueur}** : action **${subcommand}** effectuée (${type}${id ? ` : ${id}` : ''}).\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de la gestion des succès.`,
      );
    }
  },
};
