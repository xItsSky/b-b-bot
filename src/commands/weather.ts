import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { Command } from '../types/index.js';
import type { RconService } from '../services/rcon.service.js';

export const weather: Command = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Changer la météo du serveur')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Le type de météo')
        .setRequired(true)
        .addChoices(
          { name: 'Beau temps (Clear)', value: 'clear' },
          { name: 'Pluie (Rain)', value: 'rain' },
          { name: 'Orage (Thunder)', value: 'thunder' },
        ),
    )
    .addIntegerOption((option) =>
      option
        .setName('duree')
        .setDescription('Durée en secondes (optionnel)')
        .setRequired(false)
        .setMinValue(1),
    ) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ) {
    const type = interaction.options.getString('type', true);
    const duree = interaction.options.getInteger('duree');
    await interaction.deferReply();

    const command = `weather ${type}${duree ? ` ${duree}` : ''}`;

    try {
      const response = await rconService.execute(command);
      await interaction.editReply(
        `Météo changée en **${type}**${duree ? ` pour **${duree}** secondes` : ''}.\nRéponse du serveur : ${response}`,
      );
    } catch (error) {
      console.error('Erreur RCON:', error);
      await interaction.editReply(
        `Une erreur est survenue lors du changement de la météo.`,
      );
    }
  },
};
