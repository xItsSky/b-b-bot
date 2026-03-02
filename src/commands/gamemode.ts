import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const gamemode: Command = {
  data: new SlashCommandBuilder()
    .setName('gamemode')
    .setDescription("Changer le mode de jeu d'un joueur")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('mode')
        .setDescription('Le mode de jeu')
        .setRequired(true)
        .addChoices(
          { name: 'Survival', value: 'survival' },
          { name: 'Creative', value: 'creative' },
          { name: 'Adventure', value: 'adventure' },
          { name: 'Spectator', value: 'spectator' },
        ),
    )
    .addStringOption((option) =>
      option
        .setName('joueur')
        .setDescription('Le pseudo du joueur (par défaut vous-même)')
        .setRequired(false),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const mode = interaction.options.getString('mode', true);
    const joueur = interaction.options.getString('joueur') || '@s';
    await interaction.deferReply();

    try {
      const response = await rconService.execute(`gamemode ${mode} ${joueur}`);
      await interaction.editReply(
        `Mode de jeu de **${joueur === '@s' ? 'soi-même' : joueur}** changé en **${mode}**.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors du changement de mode de jeu.`,
      );
    }
  },
};
