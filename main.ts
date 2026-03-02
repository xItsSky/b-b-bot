import { Client, Events, GatewayIntentBits } from 'discord.js';
import process from 'process';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('DISCORD_TOKEN is not defined in the environment variables.');
  process.exit(1);
}

client.login(token);
