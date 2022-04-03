import notifierRefresh from './notifier/refresh';
import type { Notifier, Observer } from './notifier/types';
import notifierUnobserve from './notifier/unobserve';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const ensureHasActiveObserver = (notifier: Notifier<any, any>, observer: Observer<any, any>) => {
  if (notifier.activeObservers.includes(observer)) return notifier;

  throw new Error('Observer is not attached to notifier');
};

/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserve = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  observer: Observer<any, any>,
): AbsintheSocket =>
  updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierUnobserve(ensureHasActiveObserver(notifier, observer), observer)),
  );

export default unobserve;