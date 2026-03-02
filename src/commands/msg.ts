import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const msg: Command = {
  data: new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Envoie un message à tous les joueurs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Le message à envoyer')
        .setRequired(true),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const message = interaction.options.getString('message', true);
    await interaction.deferReply();

    // Construction du tellraw pour un affichage propre
    const tellrawCommand = `tellraw @a {"text":"[Serveur] ${message}","color":"red"}`;

    try {
      await rconService.execute(tellrawCommand);
      await interaction.editReply(`Message envoyé : ${message}`);
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        "Une erreur est survenue lors de l'envoi du message.",
      );
    }
  },
};
