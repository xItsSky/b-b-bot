import { list } from './list.js';
import { msg } from './msg.js';
import { whitelist } from './whitelist.js';
import { ban } from './ban.js';
import { unban } from './unban.js';
import { kick } from './kick.js';
import { restart } from './restart.js';
import { op } from './op.js';
import { deop } from './deop.js';
import { tp } from './tp.js';
import { gamemode } from './gamemode.js';
import { weather } from './weather.js';
import { advancement } from './advancement.js';
import { give } from './give.js';
import type { Command } from '../types/index.js';

export const commands: Record<string, Command> = {
  list,
  msg,
  whitelist,
  ban,
  unban,
  kick,
  restart,
  op,
  deop,
  tp,
  gamemode,
  weather,
  advancement,
  give,
};
