import type {EmptyObject} from '@absinthe/graphql-utils';
import type {Notifier} from "./types";

const cancel = <Result, Variables extends void | EmptyObject>({
  activeObservers,
  canceledObservers,
  ...rest
}: Notifier<Result, Variables>) => ({
  ...rest,
  isActive: false,
  activeObservers: [],
  canceledObservers: [...activeObservers, ...canceledObservers]
});

export default cancel;
