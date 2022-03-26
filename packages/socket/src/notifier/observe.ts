import type { EmptyObject } from '@absinthe/graphql-utils';

import type { Notifier, Observer } from './types';

const observe = <Result, Variables extends void | EmptyObject>(
  { activeObservers, ...rest }: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>,
): Notifier<Result, Variables> => ({
  ...rest,
  isActive: true,
  activeObservers: [...activeObservers, observer],
});

export default observe;
