import type {EmptyObject} from '@absinthe/graphql-utils';

import type {AnyEvent, Observer} from "../types";

type HandlerName = `on${AnyEvent['name']}`

const getNotifier = (handlerName: HandlerName, payload: unknown) => (observer: Observer<any, any>) =>
  observer[handlerName]?.(payload);

const getHandlerName = ({ name }: AnyEvent): HandlerName => `on${name}`;

const notifyAll = <Result, Variables extends void | EmptyObject>(
  observers: ReadonlyArray<Observer<Result, Variables>>,
  event: AnyEvent
) => observers.forEach(getNotifier(getHandlerName(event), event.payload));

export default notifyAll;
