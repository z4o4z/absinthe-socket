import type { EmptyObject, GqlRequest } from '@absinthe/graphql-utils';

import type { AbsintheAnyEvent } from './absinthe-event/types';
import handlePush from './handlePush';
import notifierFind from './notifier/find';
import { Notifier } from './notifier/types';
import type { AbsintheSocket, NotifierPushHandler, PushHandler } from './types';

type GenericHandler = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, ...args: any[]) => void;

type PushHandlerMethod<Handler extends GenericHandler> = Handler extends (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  ...args: infer Args
) => void
  ? (...args: Args) => void
  : () => void;

const getPushHandlerMethodGetter =
  (absintheSocket: AbsintheSocket, request: GqlRequest<any>) =>
  <Handler extends GenericHandler>(handle: Handler): PushHandlerMethod<Handler> =>
    ((...args) => {
      const notifier = notifierFind(absintheSocket.notifiers, 'request', request);

      if (notifier) {
        handle(absintheSocket, notifier, ...args);
      }
    }) as PushHandlerMethod<Handler>;

const getPushHandler = <Variables extends void | EmptyObject, Response extends EmptyObject>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
): PushHandler<Response> => {
  const pushHandlerMethodGetter = getPushHandlerMethodGetter(absintheSocket, request);

  return {
    onError: pushHandlerMethodGetter(notifierPushHandler.onError),
    onSucceed: pushHandlerMethodGetter(notifierPushHandler.onSucceed),
    onTimeout: pushHandlerMethodGetter(notifierPushHandler.onTimeout),
  };
};

const pushAbsintheEvent = <Variables extends void | EmptyObject, Response extends EmptyObject>(
  absintheSocket: AbsintheSocket,
  request: GqlRequest<Variables>,
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheEvent: AbsintheAnyEvent,
) => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler),
  );

  return absintheSocket;
};

export default pushAbsintheEvent;
