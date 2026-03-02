import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const deop: Command = {
  data: new SlashCommandBuilder()
    .setName('deop')
    .setDescription('Retirer les privilèges administrateur à un joueur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
      const response = await rconService.execute(`deop ${pseudo}`);
      await interaction.editReply(
        `Le joueur **${pseudo}** n'est plus administrateur.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de l'exécution de la commande deop pour **${pseudo}**.`,
      );
    }
  },
};
