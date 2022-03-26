import type { EmptyObject } from '@absinthe/graphql-utils';

import { createResultEvent } from './event/eventCreators';
import notifyActive from './notifyActive';
import type { Notifier } from './types';

const notifyResultEvent = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>,
  result: Result,
): Notifier<Result, Variables> => notifyActive(notifier, createResultEvent(result));

export default notifyResultEvent;
