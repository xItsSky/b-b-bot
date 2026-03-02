import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const unban: Command = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Débannir un joueur du serveur')
    .addStringOption((option) =>
      option
        .setName('pseudo')
        .setDescription('Le pseudo du joueur à débannir')
        .setRequired(true),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const pseudo = interaction.options.getString('pseudo', true);

    await interaction.deferReply();

    try {
      const response = await rconService.execute(`pardon ${pseudo}`);
      await interaction.editReply(
        `Le joueur **${pseudo}** a été débanni.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors du débannissement de **${pseudo}**.`,
      );
    }
  },
};
