import {EventName} from "./constants";

import type {
  AbortEvent,
  CancelEvent,
  ErrorEvent,
  Notifier,
  ResultEvent,
  StartEvent
} from "../types";

export const createStartEvent = <Payload extends Notifier<any, any>>(
  payload: Payload
): StartEvent<Payload> => ({
  name: EventName.START,
  payload, 
});

export const createResultEvent = <Result>(payload: Result): ResultEvent<Result> => ({
  name: EventName.RESULT,
  payload,
});

export const createErrorEvent = (payload: Error): ErrorEvent => ({
  name: EventName.ERROR,
  payload,
});

export const createCancelEvent = (): CancelEvent => ({
  name: EventName.CANCEL,
  payload: undefined
});

export const createAbortEvent = (payload: Error): AbortEvent => ({
  name: EventName.ABORT,
  payload,
});

