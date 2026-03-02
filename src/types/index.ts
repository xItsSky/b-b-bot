import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import type { RconService } from '../services/rcon.service.js';

export interface RconConfig {
  host: string;
  port: number;
  password: string;
}

export interface BotConfig {
  token: string;
  rcon: RconConfig;
}

export interface Command {
  data: SlashCommandBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ): Promise<void>;
}
