import notifierCancel from './notifier/cancel';
import notifierFlushCanceled from './notifier/flushCanceled';
import notifierRefresh from './notifier/refresh';
import notifierRemove from './notifier/remove';
import { RequestStatus } from './notifier/constants';
import type { Notifier } from './notifier/types';
import refreshNotifier from './refreshNotifier';
import { unsubscribe } from './subscription';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const cancelQueryOrMutationSending = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  updateNotifiers(absintheSocket, notifierRefresh(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutationIfSending = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.requestStatus === RequestStatus.SENDING
    ? cancelQueryOrMutationSending(absintheSocket, notifier)
    : absintheSocket;

const cancelPending = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifierCancel(notifier))));

const cancelQueryOrMutation = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.requestStatus === RequestStatus.PENDING
    ? cancelPending(absintheSocket, notifier)
    : cancelQueryOrMutationIfSending(absintheSocket, notifier);

const unsubscribeIfNeeded = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.requestStatus === RequestStatus.SENT ? unsubscribe(absintheSocket, notifier) : absintheSocket;

const cancelNonPendingSubscription = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  unsubscribeIfNeeded(absintheSocket, refreshNotifier(absintheSocket, notifierCancel(notifier)));

const cancelSubscription = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.requestStatus === RequestStatus.PENDING
    ? cancelPending(absintheSocket, notifier)
    : cancelNonPendingSubscription(absintheSocket, notifier);

const cancelActive = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.operationType === 'subscription'
    ? cancelSubscription(absintheSocket, notifier)
    : cancelQueryOrMutation(absintheSocket, notifier);

/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */
const cancel = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>): AbsintheSocket =>
  notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;

export default cancel;
