import {
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const restart: Command = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Redémarrer le serveur Minecraft avec une annonce')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('Le message à afficher avant le redémarrage')
        .setRequired(false),
    )
    .addIntegerOption((option) =>
      option
        .setName('delai')
        .setDescription(
          'Délai avant le redémarrage en secondes (par défaut 10)',
        )
        .setRequired(false),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const message =
      interaction.options.getString('message') || 'Le serveur va redémarrer.';
    const delay = interaction.options.getInteger('delai') || 10;

    await interaction.deferReply();

    try {
      // Annonce immédiate
      await rconService.execute(
        `tellraw @a {"text":"[Serveur] ${message} dans ${delay} secondes.","color":"red"}`,
      );

      // On attend le délai (conversion en ms)
      // Note: Dans un environnement serverless ou avec des timeouts courts, cela pourrait être risqué,
      // mais ici on assume que le bot tourne de manière persistante.
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
      }

      // Commande de redémarrage (sur beaucoup de serveurs c'est /stop car ils ont un script de loop)
      // On utilise /stop car NitroServ redémarre généralement automatiquement si le processus s'arrête.
      await rconService.execute('stop');

      await interaction.editReply(
        `Commande de redémarrage envoyée avec un délai de ${delay} secondes.`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        'Une erreur est survenue lors de la tentative de redémarrage du serveur.',
      );
    }
  },
};
