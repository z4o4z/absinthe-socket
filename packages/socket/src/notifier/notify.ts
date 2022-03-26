import type {EmptyObject} from '@absinthe/graphql-utils';

import observerNotifyAll from "./observer/notifyAll";

import type {AnyEvent, Notifier,Observer} from "./types";

const getObservers = <Result, Variables extends void | EmptyObject>({activeObservers, canceledObservers}: Notifier<Result, Variables>): Observer<Result, Variables>[] => [
  ...activeObservers,
  ...canceledObservers
];

const notify = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>,
  event: AnyEvent
):Notifier<Result, Variables> => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
