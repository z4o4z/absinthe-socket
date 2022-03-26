import type { EmptyObject, GqlRequest } from '@absinthe/graphql-utils';

import joinChannel from './joinChannel';
import { RequestStatus } from './notifier/constants';
import notifierCreate from './notifier/create';
import notifierFind from './notifier/find';
import notifierFlushCanceled from './notifier/flushCanceled';
import notifierReactivate from './notifier/reactivate';
import type { Notifier } from './notifier/types';
import pushRequest from './pushRequest';
import refreshNotifier from './refreshNotifier';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const connectOrJoinChannel = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
};

const sendNew = (absintheSocket: AbsintheSocket, request: GqlRequest<any>) => {
  const notifier = notifierCreate(request);

  updateNotifiers(absintheSocket, (notifiers) => [...notifiers, notifier]);

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
};

const updateCanceledReactivate = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  refreshNotifier(absintheSocket, notifierReactivate(notifier));

const updateCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.requestStatus === RequestStatus.SENDING
    ? updateCanceledReactivate(absintheSocket, notifierFlushCanceled(notifier))
    : updateCanceledReactivate(absintheSocket, notifier);

const updateIfCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);

const getExistentIfAny = (absintheSocket: AbsintheSocket, request: GqlRequest<any>) => {
  const notifier = notifierFind(absintheSocket.notifiers, 'request', request);

  return notifier && updateIfCanceled(absintheSocket, notifier);
};

/**
 * Sends given request and returns an object (notifier) to track its progress
 * (see observe function)
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * // This example uses a subscription, but the functionallity is the same for
 * // all operation types (queries, mutations and subscriptions)
 *
 * const notifier = withAbsintheSocket.send(absintheSocket, {
 *   operation,
 *   variables: {userId: 10}
 * });
 */
const send = <Result, Variables extends void | EmptyObject>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<Variables>,
): Notifier<Result, Variables> => getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);

export default send;
