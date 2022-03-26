import { type EmptyObject, type GqlRequest } from '@absinthe/graphql-utils';

import { RequestStatus } from './constants';
import type { Notifier } from './types';

const create = <Variables extends void | EmptyObject>(
  request: GqlRequest<Variables>,
): Notifier<unknown, Variables> => ({
  request,
  isActive: true,
  requestStatus: RequestStatus.PENDING,
  operationType: request.operation,
  activeObservers: [],
  canceledObservers: [],
});

export default create;
