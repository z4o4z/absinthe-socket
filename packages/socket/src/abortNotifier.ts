import { createAbortEvent } from './notifier/event/eventCreators';
import notifierNotify from './notifier/notify';
import notifierRemove from './notifier/remove';
import type { Notifier } from './notifier/types';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const abortNotifier = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, error: Error) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierNotify(notifier, createAbortEvent(error))));

export default abortNotifier;
