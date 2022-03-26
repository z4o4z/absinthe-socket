import notifierRefresh from './notifier/refresh';
import type { Notifier } from './notifier/types';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const refreshNotifier = <N extends Notifier<any, any>>(absintheSocket: AbsintheSocket, notifier: N): N => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
