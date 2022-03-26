import deepEqual from 'fast-deep-equal';

import type { Notifier } from './types';

const find = <Key extends keyof Notifier<any, any>>(
  notifiers: Array<Notifier<any, any>>,
  key: Key,
  value: Notifier<any, any>[Key],
): null | Notifier<any, any> => notifiers.find((notifier) => deepEqual(notifier[key], value)) ?? null;

export default find;
