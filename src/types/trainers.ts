import type { Trainer } from './index';

export const TRAINERS: Record<string, Trainer> = {
  '5bar': {
    id: '5bar',
    name: '5-Bar',
    defaultMinDelay: 0,
    defaultMaxDelay: 10,
    drills: [
      { id: 'wall', name: 'Wall' },
      { id: 'lane', name: 'Lane' },
      { id: 'hook', name: 'Hook' },
    ],
  },
  '3bar': {
    id: '3bar',
    name: '3-Bar',
    defaultMinDelay: 0,
    defaultMaxDelay: 15,
    drills: [
      { id: 'pull', name: 'Pull' },
      { id: 'push', name: 'Push' },
    ],
  },
};

export const DEFAULT_TRAINER_ID = '5bar';
