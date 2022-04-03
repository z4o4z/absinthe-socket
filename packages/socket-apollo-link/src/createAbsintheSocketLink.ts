import { EmptyObject } from '@absinthe/graphql-utils';
import type { AbsintheSocket, GqlRequest, Notifier, Observer } from '@absinthe/socket';
import { send, toObservable, unobserveOrCancel } from '@absinthe/socket';
import { ApolloLink } from 'apollo-link';
import { print } from 'graphql';
import type { DocumentNode } from 'graphql/language/ast';

type ApolloOperation<Variables> = {
  query: DocumentNode;
  variables: Variables;
};

const unobserveOrCancelIfNeeded = <Result, Variables extends void | EmptyObject>(
  absintheSocket: AbsintheSocket,
  notifier?: Notifier<Result, Variables>,
  observer?: Observer<Result, Variables>,
): void => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const notifierToObservable =
  <Result, Variables extends void | Object>(
    absintheSocket: AbsintheSocket,
    onError: Observer<Result, Variables>['onError'],
    onStart: Observer<Result, Variables>['onStart'],
  ) =>
  (notifier: Notifier<Result, Variables>) =>
    toObservable(absintheSocket, notifier, {
      onError,
      onStart,
      unsubscribe: unobserveOrCancelIfNeeded,
    });

const getRequest = <Variables extends Object>({
  query,
  variables,
}: ApolloOperation<Variables>): GqlRequest<Variables> => ({
  operation: print(query),
  variables,
});

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = <Result, Variables extends void | Object>(
  absintheSocket: AbsintheSocket,
  onError?: $ElementType<Observer<Result, Variables>, 'onError'>,
  onStart?: $ElementType<Observer<Result, Variables>, 'onStart'>,
) =>
  new ApolloLink(
    compose(
      notifierToObservable(absintheSocket, onError, onStart),
      (request) => send(absintheSocket, request),
      getRequest,
    ),
  );

export default createAbsintheSocketLink;
