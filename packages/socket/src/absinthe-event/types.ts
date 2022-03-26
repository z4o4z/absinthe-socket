import type {EmptyObject,GqlRequestCompat} from '@absinthe/graphql-utils';

import {AbsintheEventName} from "./constants";



export interface BaseAbsintheEvent<Payload> {
  name: AbsintheEventName,
  payload: Payload
};

export interface AbsintheUnsubscribeEventPayload {
  subscriptionId: string
}

export interface AbsintheUnsubscribeEvent extends BaseAbsintheEvent<AbsintheUnsubscribeEventPayload> {
  name: AbsintheEventName.UNSUBSCRIBE,
};

export interface AbsintheDocEventPayload<Variables extends void | EmptyObject> extends GqlRequestCompat<Variables>{}

export interface AbsintheDocEvent<Variables extends void | EmptyObject> extends  BaseAbsintheEvent<AbsintheDocEventPayload<Variables>> {
  name: AbsintheEventName.DOC,
}

export type AbsintheAnyEvent = AbsintheDocEvent<void | EmptyObject> | AbsintheUnsubscribeEvent;


