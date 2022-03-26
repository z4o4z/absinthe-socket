import type { Notifier } from './notifier/types';
import type { AbsintheSocket } from './types';

const updateNotifiers = (
  absintheSocket: AbsintheSocket,
  updater: (notifiers: Notifier<any, any>[]) => Notifier<any, any>[],
): AbsintheSocket => {
  // eslint-disable-next-line no-param-reassign
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
