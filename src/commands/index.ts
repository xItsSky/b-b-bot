import { list } from './list.js';
import { msg } from './msg.js';
import type { Command } from '../types/index.js';

export const commands: Record<string, Command> = {
  list,
  msg,
};
