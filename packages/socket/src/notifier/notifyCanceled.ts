import type { EmptyObject } from '@absinthe/graphql-utils';

import observerNotifyAll from './observer/notifyAll';
import type { AnyEvent, Notifier } from './types';

const notifyCanceled = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>,
  event: AnyEvent,
): Notifier<Result, Variables> => {
  observerNotifyAll(notifier.canceledObservers, event);

  return notifier;
};

export default notifyCanceled;