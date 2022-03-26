import type { EmptyObject } from '@absinthe/graphql-utils';

import notifierRefresh from './notifier/refresh';
import updateNotifiers from './updateNotifiers';

import type { AbsintheSocket } from './types';
import type { Notifier } from './notifier/types';

const refreshNotifier = <Result, Variables extends void | EmptyObject>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
) => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier));

  return notifier;
};

export default refreshNotifier;
