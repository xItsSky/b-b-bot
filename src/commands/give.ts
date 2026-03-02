import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const give: Command = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Donner un objet à un joueur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('joueur')
        .setDescription('Le pseudo du joueur (par défaut vous-même)')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('item')
        .setDescription("L'ID de l'objet (ex: minecraft:diamond)")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('quantite')
        .setDescription('La quantité d’objets (par défaut 1)')
        .setRequired(false)
        .setMinValue(1),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const joueur = interaction.options.getString('joueur', true);
    const item = interaction.options.getString('item', true);
    const quantite = interaction.options.getInteger('quantite') || 1;

    await interaction.deferReply();

    try {
      const response = await rconService.execute(
        `give ${joueur} ${item} ${quantite}`,
      );
      await interaction.editReply(
        `Don de **${quantite}x ${item}** à **${joueur}**.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de l'envoi de l'objet.`,
      );
    }
  },
};
