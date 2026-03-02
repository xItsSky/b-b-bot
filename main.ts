import {
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  REST,
  Routes,
} from 'discord.js';
import { RconService } from './src/services/rcon.service.js';
import { commands } from './src/commands/index.js';
import { config } from './src/config/index.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rconService = new RconService(config.rcon);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(config.token);
  try {
    console.log('Started refreshing application (/) commands.');
    const commandData = Object.values(commands).map((command) =>
      command.data.toJSON(),
    );
    await rest.put(Routes.applicationCommands(readyClient.user.id), {
      body: commandData,
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error while registering commands:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (!command) return;

  // Security check: Verify administrator permissions if the command is restricted
  if (
    command.data.default_member_permissions ===
      PermissionFlagsBits.Administrator.toString() &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
  ) {
    await interaction.reply({
      content:
        "Vous n'avez pas la permission d'exécuter cette commande d'administration.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction, rconService);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    const errorMessage = 'There was an error while executing this command!';

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          ephemeral: true,
        });
      }
    } catch (followUpError) {
      console.error('Error while sending error message:', followUpError);
    }
  }
});

if (!config.token) {
  console.error('DISCORD_TOKEN is not defined in the configuration.');
  process.exit(1);
}

client.login(config.token);
