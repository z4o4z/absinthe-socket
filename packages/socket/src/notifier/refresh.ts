import findIndex from './findIndex';
import type { Notifier } from './types';

const refresh =
  (notifier: Notifier<any, any>) =>
  (notifiers: Notifier<any, any>[]): Notifier<any, any>[] => {
    const index = findIndex(notifiers, 'request', notifier.request);

    return [...notifiers.slice(0, index), notifier, ...notifiers.slice(index + 1)];
  };

export default refresh;
