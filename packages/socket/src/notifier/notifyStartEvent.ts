import type {EmptyObject} from '@absinthe/graphql-utils';

import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const notifyStartEvent = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>
):Notifier<Result, Variables> => notifyActive(notifier, createStartEvent<Notifier<Result, Variables>>(notifier));

export default notifyStartEvent;
