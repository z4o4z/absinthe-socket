import type {
  GqlOperationType,
  GqlRequest,
  EmptyObject
} from "@absinthe/graphql-utils";

import type { EventName } from "./event/constants";
import type {RequestStatus} from "./constants";


export interface Observer<Result, Variables extends void | EmptyObject = void>  {
  onAbort?: (error: Error) => void,
  onError?: (error: Error) => void,
  onStart?: (notifier: Notifier<Result, Variables>) => void,
  onCancel?: () => void,
  onResult?: (result: Result) => void
};


export interface Notifier<Result, Variables extends void | EmptyObject = void>  {
  request: GqlRequest<Variables>,
  isActive: boolean,
  requestStatus: RequestStatus,
  operationType: GqlOperationType,
  subscriptionId?: string
  activeObservers: ReadonlyArray<Observer<Result, Variables>>,
  canceledObservers: ReadonlyArray<Observer<Result, Variables>>,
};


export interface BaseEvent<Payload = void>  {
  name: EventName,
  payload: Payload,
};

export interface StartEvent<Payload extends Notifier<any, any>> extends BaseEvent<Payload> {
  name: EventName.START,
}

export interface ResultEvent<Result> extends BaseEvent<Result> {
  name: EventName.RESULT,
}

export interface CancelEvent extends BaseEvent {
  name: EventName.CANCEL,
}

export interface ErrorEvent extends BaseEvent<Error> {
  name: EventName.ERROR,
}


export interface AbortEvent extends BaseEvent<Error> {
  name: EventName.ABORT,
}

export type AnyEvent =
  | AbortEvent
  | CancelEvent
  | ErrorEvent
  | ResultEvent<unknown>
  | StartEvent<Notifier<unknown, void | EmptyObject>>;

