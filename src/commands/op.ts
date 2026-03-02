import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const op: Command = {
  data: new SlashCommandBuilder()
    .setName('op')
    .setDescription('Donner les privilèges administrateur à un joueur')
    .addStringOption((option) =>
      option
        .setName('pseudo')
        .setDescription('Le pseudo du joueur')
        .setRequired(true),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const pseudo = interaction.options.getString('pseudo', true);
    await interaction.deferReply();

    try {
      const response = await rconService.execute(`op ${pseudo}`);
      await interaction.editReply(
        `Le joueur **${pseudo}** est maintenant administrateur.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de l'exécution de la commande op pour **${pseudo}**.`,
      );
    }
  },
};
