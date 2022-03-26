import type { EmptyObject } from '@absinthe/graphql-utils';

import notifierObserve from './notifier/observe';
import type { Notifier, Observer } from './notifier/types';
import refreshNotifier from './refreshNotifier';
import type { AbsintheSocket } from './types';

/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */
const observe = <Result, Variables extends void | EmptyObject>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>,
) => refreshNotifier(absintheSocket, notifierObserve(notifier, observer));

export default observe;
