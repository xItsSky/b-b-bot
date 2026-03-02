import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const kick: Command = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un joueur du serveur')
    .addStringOption((option) =>
      option
        .setName('pseudo')
        .setDescription('Le pseudo du joueur à expulser')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('raison')
        .setDescription("La raison de l'expulsion")
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
      const response = await rconService.execute(`kick ${pseudo} ${raison}`);
      await interaction.editReply(
        `Le joueur **${pseudo}** a été expulsé. Raison : ${raison}\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de l'expulsion de **${pseudo}**.`,
      );
    }
  },
};
