import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const ban: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un joueur du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('pseudo')
        .setDescription('Le pseudo du joueur à bannir')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('raison')
        .setDescription('La raison du bannissement')
        .setRequired(false),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const pseudo = interaction.options.getString('pseudo', true);
    const raison =
      interaction.options.getString('raison') || 'Aucune raison fournie';

    await interaction.deferReply();

    try {
      const response = await rconService.execute(`ban ${pseudo} ${raison}`);
      await interaction.editReply(
        `Joueur **${pseudo}** a été banni. Raison : ${raison}\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors du bannissement de **${pseudo}**.`,
      );
    }
  },
};
