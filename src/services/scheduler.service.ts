import cron from 'node-cron';
import type { RconService } from './rcon.service.js';
import type { ScheduledTask } from '../types/index.js';
import { schedulerConfig } from '../config/scheduler.config.js';

export class SchedulerService {
  private rconService: RconService;

  constructor(rconService: RconService) {
    this.rconService = rconService;
  }

  /**
   * Initialise et démarre toutes les tâches planifiées
   */
  public init(): void {
    console.log(
      `Initialisation du scheduler avec ${schedulerConfig.length} tâches.`,
    );

    for (const task of schedulerConfig) {
      this.scheduleTask(task);
    }
  }

  /**
   * Planifie une tâche individuelle
   */
  private scheduleTask(task: ScheduledTask): void {
    if (!cron.validate(task.cron)) {
      console.error(
        `Format cron invalide pour la tâche "${task.name}": ${task.cron}`,
      );
      return;
    }

    cron.schedule(task.cron, async () => {
      console.log(
        `[Scheduler] Exécution de la tâche: ${task.name} (${task.command})`,
      );
      try {
        const response = await this.rconService.execute(task.command);
        console.log(
          `[Scheduler] Réponse du serveur pour ${task.name}: ${response}`,
        );
      } catch (error) {
        console.error(
          `[Scheduler] Erreur lors de l'exécution de ${task.name}:`,
          error,
        );
      }
    });

    console.log(`Tâche planifiée : "${task.name}" [Cron: ${task.cron}]`);
  }
}
