import { ControlledPromise, createControlledPromise } from '@absinthe/graphql-utils';
import type { AbsintheSocket, Notifier, Observer } from '@absinthe/socket';
import { notifierFind, observe, send, unobserveOrCancel } from '@absinthe/socket';
import type { GraphQLResponse, SubscribeFunction } from 'relay-runtime';
import { Observable } from 'relay-runtime';

import subscriptions from './subscriptions';

const unobserveOrCancelIfNeeded = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any> | null,
  observer: Observer<any, any>,
) => {
  if (notifier) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

// const createDisposable = (
//   absintheSocket: AbsintheSocket,
//   { request }: Notifier<any, any>,
//   observer: Observer<any, any>,
// ) => ({
//   dispose: () =>
//     unobserveOrCancelIfNeeded(absintheSocket, notifierFind(absintheSocket.notifiers, 'request', request), observer),
// });

const onStart = (promise: ControlledPromise<Notifier<any, any>>) => (notifier: Notifier<any, any>) =>
  promise.resolve(notifier);

const onAbort =
  (promise: ControlledPromise<Notifier<any, any>>, callback?: (error: Error) => void) => (error: Error) => {
    callback?.(error);
    promise.reject(error);
  };

/**
 * Creates a Subscriber (Relay SubscribeFunction) using the given AbsintheSocket
 * instance
 */
const createSubscriber =
  (absintheSocket: AbsintheSocket, onRecoverableError?: (error: Error) => any): SubscribeFunction =>
  ({ operationKind }, variables) => {
    if (operationKind !== 'subscription') {
      throw new Error(`Expected subscription, but instead got:\n${operationKind}`);
    }

    const notifier = send(absintheSocket, { operation: operationKind, variables });

    const promise = createControlledPromise<Notifier<any, any>>();

    const observable = Observable.create<GraphQLResponse>((sink) => {
      const observer = {
        onStart: onStart(promise),
        onAbort: onAbort(promise, sink.error),
        onError: onRecoverableError,
        onResult: sink.next,
      };

      observe(absintheSocket, notifier, observer);

      return () => {
        unobserveOrCancelIfNeeded(
          absintheSocket,
          notifierFind(absintheSocket.notifiers, 'request', notifier.request),
          observer,
        );
      };
    });

    subscriptions.set(observable, promise);

    return observable;
  };

export default createSubscriber;
