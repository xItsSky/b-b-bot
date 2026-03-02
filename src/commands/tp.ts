import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const tp: Command = {
  data: new SlashCommandBuilder()
    .setName('tp')
    .setDescription(
      'Téléporter un joueur vers un autre ou vers des coordonnées',
    )
    .addStringOption((option) =>
      option
        .setName('joueur')
        .setDescription('Le joueur à téléporter')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('destination')
        .setDescription('Le joueur cible ou les coordonnées (x y z)')
        .setRequired(true),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const joueur = interaction.options.getString('joueur', true);
    const destination = interaction.options.getString('destination', true);
    await interaction.deferReply();

    try {
      const response = await rconService.execute(`tp ${joueur} ${destination}`);
      await interaction.editReply(
        `Téléportation effectuée : **${joueur}** vers **${destination}**.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de la téléportation.`,
      );
    }
  },
};
