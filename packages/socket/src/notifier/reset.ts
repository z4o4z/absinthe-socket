import type {EmptyObject} from '@absinthe/graphql-utils';

import flushCanceled from "./flushCanceled";
import {RequestStatus} from "./constants";

import type {Notifier} from "./types";

const reset = <Result, Variables extends void | EmptyObject>(
  notifier: Notifier<Result, Variables>
): Notifier<Result, Variables> =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: RequestStatus.PENDING,
  });

export default reset;
