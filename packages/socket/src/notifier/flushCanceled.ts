import type {EmptyObject} from '@absinthe/graphql-utils';

import notifyCanceled from "./notifyCanceled";
import {createCancelEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const clearCanceled = <Result, Variables extends void | EmptyObject>(notifier: Notifier<any, any>):Notifier<Result, Variables> => ({
  ...notifier,
  canceledObservers: []
});

const flushCanceled = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>
): Notifier<Result, Variables> =>
  notifier.canceledObservers.length > 0
    ? clearCanceled(notifyCanceled(notifier, createCancelEvent()))
    : notifier;

export default flushCanceled;
