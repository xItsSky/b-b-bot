import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const list: Command = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Liste les joueurs connectés au serveur Minecraft')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    await interaction.deferReply();
    try {
      const response = await rconService.execute('list');
      await interaction.editReply(response || 'Aucune réponse du serveur.');
    } catch (error) {
      console.error('Erreur RCON:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(
          "Une erreur est survenue lors de l'exécution de la commande RCON.",
        );
      } else {
        await interaction.reply({
          content:
            "Une erreur est survenue lors de l'exécution de la commande RCON.",
          ephemeral: true,
        });
      }
    }
  },
};
