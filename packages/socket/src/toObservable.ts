import type { EmptyObject } from '@absinthe/graphql-utils';
import { Observable } from 'zen-observable-ts';

import notifierFind from './notifier/find';
import type { Notifier, Observer } from './notifier/types';
import observe from './observe';
import type { AbsintheSocket } from './types';

type Unsubscribe<Result, Variables extends void | EmptyObject> = (
  absintheSocket: AbsintheSocket,
  notifier?: Notifier<Result, Variables>,
  observer?: Observer<Result, Variables>,
) => void;

interface Options<Result, Variables extends void | EmptyObject> {
  onError: Observer<Result, Variables>['onError'];
  onStart: Observer<Result, Variables>['onStart'];
  unsubscribe: Unsubscribe<Result, Variables>;
}

interface ObservableRequired<Result, Variables extends void | EmptyObject> extends Partial<Options<Result, Variables>> {
  onAbort: (errorValue: any) => void;
  onResult: (result: any) => void;
}

const getUnsubscriber =
  <Result, Variables extends void | EmptyObject>(
    absintheSocket: AbsintheSocket,
    { request }: Notifier<Result, Variables>,
    observer: ObservableRequired<Result, Variables>,
    unsubscribe: Unsubscribe<Result, Variables>,
  ) =>
  () => {
    const notifier = notifierFind(absintheSocket.notifiers, 'request', request);

    unsubscribe(absintheSocket, notifier ?? undefined, notifier ? observer : undefined);
  };

const onResult =
  <Result, Variables extends void | EmptyObject>(
    { operationType }: Notifier<Result, Variables>,
    observableObserver: ZenObservable.SubscriptionObserver<unknown>,
  ) =>
  (result: any) => {
    observableObserver.next(result);

    if (operationType !== 'subscription') {
      observableObserver.complete();
    }
  };

const createObserver = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>,
  handlers: Partial<Options<Result, Variables>>,
  observableObserver: ZenObservable.SubscriptionObserver<unknown>,
): ObservableRequired<Result, Variables> => ({
  ...handlers,
  onAbort: observableObserver.error.bind(observableObserver),
  onResult: onResult(notifier, observableObserver),
});

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result, Variables>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result, Variables>): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
 *   if (notifier && observer) {
 *     withAbsintheSocket.unobserveOrCancel(absintheSocket, notifier, observer);
 *   }
 * };
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const observable = withAbsintheSocket.toObservable(absintheSocket, notifier, {
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   unsubscribe: unobserveOrCancelIfNeeded
 * });
 */
const toObservable = <Result, Variables extends void | EmptyObject>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  { unsubscribe, ...handlers }: Partial<Options<Result, Variables>> = {},
) =>
  new Observable((observableObserver) => {
    const observer = createObserver(notifier, handlers, observableObserver);

    observe(absintheSocket, notifier, observer);

    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  });

export default toObservable;
