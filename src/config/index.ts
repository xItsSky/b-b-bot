import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BotConfig } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(
  __dirname,
  '../../../configuration/configuration.json',
);

export function loadConfig(): BotConfig {
  let fileConfig: Partial<BotConfig> = {};

  if (fs.existsSync(configPath)) {
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    try {
      fileConfig = JSON.parse(fileContent) as BotConfig;
    } catch (error) {
      console.warn(`Failed to parse configuration file: ${error}`);
    }
  }

  return {
    token: process.env['DISCORD_TOKEN'] ?? fileConfig.token ?? '',
    rcon: {
      host: process.env['RCON_HOST'] ?? fileConfig.rcon?.host ?? 'localhost',
      port: process.env['RCON_PORT']
        ? parseInt(process.env['RCON_PORT'], 10)
        : (fileConfig.rcon?.port ?? 25575),
      password: process.env['RCON_PASSWORD'] ?? fileConfig.rcon?.password ?? '',
    },
  };
}

export const config = loadConfig();
