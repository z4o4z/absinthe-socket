import type { EmptyObject } from '@absinthe/graphql-utils';

import type { Notifier } from './types';

const reactivate = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>,
): Notifier<Result, Variables> => (notifier.isActive ? notifier : { ...notifier, isActive: true });

export default reactivate;
