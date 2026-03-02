import type { ScheduledTask } from '../types/index.js';

/**
 * Configuration des tâches planifiées pour le serveur Minecraft
 */
export const schedulerConfig: ScheduledTask[] = [
  {
    name: 'Apollyon Spawn',
    cron: '0 20 * * 5', // Tous les vendredis à 20h00
    command: 'function worldboss:apollyon/spawn',
  },
  {
    name: 'Apollyon Despawn',
    cron: '59 23 * * 7', // Tous les dimanches à 23h59
    command: 'function worldboss:apollyon/despawn',
  },
];
