// @flow

import type { AbsintheSocket } from '@absinthe/socket';
import { observe, send } from '@absinthe/socket';
import type { FetchFunction, GraphQLResponse, Variables } from 'relay-runtime';

/**
 * Creates a Fetcher (Relay FetchFunction) using the given AbsintheSocket
 * instance
 */
const createFetcher =
  (absintheSocket: AbsintheSocket, onError?: (error: Error) => any): FetchFunction =>
  ({ operationKind }, variables) =>
    new Promise<GraphQLResponse>((resolve, reject) => {
      observe<GraphQLResponse, Variables>(
        absintheSocket,
        send(absintheSocket, { operation: operationKind, variables }),
        {
          onError: (...args) => onError?.(...args),
          onAbort: reject,
          onResult: resolve,
        },
      );
    });

export default createFetcher;
