import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const whitelist: Command = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Gérer la whitelist du serveur')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Ajouter un joueur à la whitelist')
        .addStringOption((option) =>
          option
            .setName('pseudo')
            .setDescription('Le pseudo du joueur')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Retirer un joueur de la whitelist')
        .addStringOption((option) =>
          option
            .setName('pseudo')
            .setDescription('Le pseudo du joueur')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('Afficher les joueurs dans la whitelist'),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const subcommand = interaction.options.getSubcommand();
    const pseudo = interaction.options.getString('pseudo');

    await interaction.deferReply();

    try {
      let rconCommand = '';
      let message = '';

      if (subcommand === 'add') {
        rconCommand = `whitelist add ${pseudo}`;
        message = `Joueur **${pseudo}** ajouté à la whitelist.`;
      } else if (subcommand === 'remove') {
        rconCommand = `whitelist remove ${pseudo}`;
        message = `Joueur **${pseudo}** retiré de la whitelist.`;
      } else if (subcommand === 'list') {
        rconCommand = 'whitelist list';
      }

      const response = await rconService.execute(rconCommand);

      if (subcommand === 'list') {
        await interaction.editReply(`**Whitelist :**\n${response}`);
      } else {
        await interaction.editReply(message || response);
      }
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors de l'exécution de la commande whitelist.`,
      );
    }
  },
};
