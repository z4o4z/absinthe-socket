import type { GqlError, GqlResponse } from '@absinthe/graphql-utils';
import { errorsToString } from '@absinthe/graphql-utils';

import abortNotifier from './abortNotifier';
import { createAbsintheUnsubscribeEvent } from './absinthe-event/absintheEventCreators';
import { RequestStatus } from './notifier/constants';
import { createErrorEvent } from './notifier/event/eventCreators';
import notifierFind from './notifier/find';
import notifierFlushCanceled from './notifier/flushCanceled';
import notifierNotifyCanceled from './notifier/notifyCanceled';
import notifierNotifyResultEvent from './notifier/notifyResultEvent';
import notifierNotifyStartEvent from './notifier/notifyStartEvent';
import notifierRemove from './notifier/remove';
import notifierReset from './notifier/reset';
import type { Notifier, NotifierSubscribed } from './notifier/types';
import pushAbsintheEvent from './pushAbsintheEvent';
import pushRequestUsing, { onError } from './pushRequestUsing';
import refreshNotifier from './refreshNotifier';
import type { AbsintheSocket, NotifierPushHandler } from './types';
import updateNotifiers from './updateNotifiers';

const DATA_MESSAGE_EVENT = 'subscription:data';

export interface SubscriptionPayload<Data> {
  result: GqlResponse<Data>;
  subscriptionId: string;
}

interface SubscriptionResponseSuccess {
  subscriptionId: string;
}

interface SubscriptionResponseError {
  errors: Array<GqlError>;
}

// TODO: improve this type
interface UnsubscribeResponse {}

type SubscriptionResponse = SubscriptionResponseSuccess | SubscriptionResponseError;

interface DataMessage {
  event: typeof DATA_MESSAGE_EVENT;
  payload: SubscriptionPayload<any>;
}

const onUnsubscribeSucceedCanceled = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  updateNotifiers(absintheSocket, notifierRemove(notifierFlushCanceled(notifier)));

const onUnsubscribeSucceedActive = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  // eslint-disable-next-line no-use-before-define
  subscribe(absintheSocket, refreshNotifier(absintheSocket, notifierReset(notifier)));

const createUnsubscribeError = (message: string) => new Error(`unsubscribe: ${message}`);

const unsubscribeHandler: NotifierPushHandler<UnsubscribeResponse> = {
  onError: (absintheSocket, notifier, errorMessage) =>
    abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage)),

  onTimeout: (_absintheSocket, notifier) =>
    notifierNotifyCanceled(notifier, createErrorEvent(createUnsubscribeError('timeout'))),

  onSucceed: (absintheSocket, notifier) => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  },
};

const pushAbsintheUnsubscribeEvent = (
  absintheSocket: AbsintheSocket,
  { request, subscriptionId }: NotifierSubscribed<any, any>,
) => pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({ subscriptionId }));

export const unsubscribe = (absintheSocket: AbsintheSocket, notifier: NotifierSubscribed<any, any>) =>
  pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: RequestStatus.CANCELING,
    }),
  );

const onSubscribeSucceed = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  { subscriptionId }: SubscriptionResponseSuccess,
) => {
  const subscribedNotifier = refreshNotifier(absintheSocket, {
    ...notifier,
    subscriptionId,
    requestStatus: RequestStatus.SENT,
  });

  if (subscribedNotifier.isActive) {
    notifierNotifyStartEvent(subscribedNotifier);
  } else {
    unsubscribe(absintheSocket, subscribedNotifier);
  }
};

const onSubscribe = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, response: SubscriptionResponse) => {
  if ('errors' in response) {
    onError(absintheSocket, notifier, errorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

export const subscribe = <Result, Variables extends void | Object>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
) => pushRequestUsing(absintheSocket, notifier, onSubscribe);

export const onDataMessage = (absintheSocket: AbsintheSocket, { payload }: DataMessage) => {
  const notifier = notifierFind(absintheSocket.notifiers, 'subscriptionId', payload.subscriptionId);

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result);
  }
};
