import type { EmptyObject, GqlOperationType, GqlRequest } from '@absinthe/graphql-utils';

import type { RequestStatus } from './constants';
import type { EventName } from './event/constants';

export interface Observer<Result, Variables extends void | EmptyObject = void> {
  onAbort?: (error: Error) => void;
  onError?: (error: Error) => void;
  // eslint-disable-next-line no-use-before-define
  onStart?: (notifier: Notifier<Result, Variables>) => void;
  onCancel?: () => void;
  onResult?: (result: Result) => void;
}

export interface Notifier<Result, Variables extends void | EmptyObject = void> {
  request: GqlRequest<Variables>;
  isActive: boolean;
  requestStatus: RequestStatus;
  operationType: GqlOperationType;
  subscriptionId?: string;
  activeObservers: ReadonlyArray<Observer<Result, Variables>>;
  canceledObservers: ReadonlyArray<Observer<Result, Variables>>;
}

export interface BaseEvent<Payload = void> {
  name: EventName;
  payload: Payload;
}

export interface StartEvent<Payload extends Notifier<any, any>> extends BaseEvent<Payload> {
  name: EventName.START;
}

export interface ResultEvent<Result> extends BaseEvent<Result> {
  name: EventName.RESULT;
}

export interface CancelEvent extends BaseEvent {
  name: EventName.CANCEL;
}

export interface ErrorEvent extends BaseEvent<Error> {
  name: EventName.ERROR;
}

export interface AbortEvent extends BaseEvent<Error> {
  name: EventName.ABORT;
}

export type AnyEvent = AbortEvent | CancelEvent | ErrorEvent | ResultEvent<any> | StartEvent<Notifier<any, any>>;
