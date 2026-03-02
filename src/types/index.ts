import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
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
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    rconService: RconService,
  ): Promise<void>;
}

export interface ScheduledTask {
  name: string;
  cron: string;
  command: string;
}
