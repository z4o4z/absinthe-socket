import deepEqual from 'fast-deep-equal';

import type { Notifier } from './types';

const findIndex = <Key extends keyof Notifier<any, any>>(
  notifiers: Array<Notifier<any, any>>,
  key: Key,
  value: Notifier<any, any>[Key],
): number => notifiers.findIndex((notifier) => deepEqual(notifier[key], value));

export default findIndex;
