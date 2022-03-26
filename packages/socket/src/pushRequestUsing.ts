import { requestToCompat } from '@absinthe/graphql-utils';

import abortNotifier from './abortNotifier';
import { createAbsintheDocEvent } from './absinthe-event/absintheEventCreators';
import { RequestStatus } from './notifier/constants';
import { createErrorEvent } from './notifier/event/eventCreators';
import notifierNotifyActive from './notifier/notifyActive';
import type { Notifier } from './notifier/types';
import pushAbsintheEvent from './pushAbsintheEvent';
import refreshNotifier from './refreshNotifier';
import RequestError from './requestError';
import type { AbsintheSocket, NotifierPushHandler } from './types';

const pushAbsintheDocEvent = (
  absintheSocket: AbsintheSocket,
  { request }: Notifier<any, any>,
  notifierPushHandler: NotifierPushHandler<any>,
) => pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent(requestToCompat(request)));

const setNotifierRequestStatusSending = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: RequestStatus.SENDING,
  });

const createRequestError = (message: string): RequestError => new RequestError(message);

const onTimeout = (_absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) =>
  notifierNotifyActive(notifier, createErrorEvent(createRequestError('timeout')));

export const onError = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, errorMessage: string) =>
  abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));

const getNotifierPushHandler = (onSucceed: NotifierPushHandler<any>['onSucceed']): NotifierPushHandler<any> => ({
  onError,
  onSucceed,
  onTimeout,
});

const pushRequestUsing = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  onSucceed: NotifierPushHandler<any>['onSucceed'],
): AbsintheSocket =>
  pushAbsintheDocEvent(
    absintheSocket,
    setNotifierRequestStatusSending(absintheSocket, notifier),
    getNotifierPushHandler(onSucceed),
  );

export default pushRequestUsing;
