import { Rcon } from 'rcon-client';
import type { RconConfig } from '../types/index.js';

export class RconService {
  private config: RconConfig;

  constructor(config: RconConfig) {
    this.config = config;
  }

  async execute(command: string): Promise<string> {
    try {
      const rcon = await Rcon.connect({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
      });

      try {
        const response = await rcon.send(command);
        return response;
      } finally {
        await rcon.end();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
          throw new Error(
            `Connexion RCON refusée sur ${this.config.host}:${this.config.port}. Vérifiez que le serveur Minecraft est bien démarré et que le RCON est activé.`,
          );
        }
        throw new Error(`Erreur RCON: ${error.message}`);
      }
      throw error;
    }
  }
}
