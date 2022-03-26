import type {EmptyObject} from '@absinthe/graphql-utils';



import {AbsintheEventName} from "./constants";

import type {AbsintheDocEvent, AbsintheUnsubscribeEvent, AbsintheUnsubscribeEventPayload, } from "./types";

export const createAbsintheUnsubscribeEvent = (
  payload: AbsintheUnsubscribeEventPayload
): AbsintheUnsubscribeEvent => ({
  name: AbsintheEventName.UNSUBSCRIBE,
  payload,
});

export const createAbsintheDocEvent = <Variables extends void | EmptyObject>(
  payload: $ElementType<AbsintheDocEvent<Variables>, "payload">
): AbsintheDocEvent<Variables> => ({
  payload,
  name: absintheEventNames.doc
});


