import type { EmptyObject } from '@absinthe/graphql-utils';

import type { Notifier, Observer } from './types';

const removeObserver = <Result, Variables extends void | EmptyObject>(
  observers: ReadonlyArray<Observer<Result, Variables>>,
  observer: Observer<Result, Variables>,
): ReadonlyArray<Observer<Result, Variables>> => {
  const index = observers.indexOf(observer);

  if (index === -1) {
    return observers;
  }

  return [...observers.slice(0, index), ...observers.slice(index + 1)];
};

const unobserve = <Result, Variables extends void | EmptyObject>(
  { activeObservers, ...rest }: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>,
) => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer),
});

export default unobserve;
