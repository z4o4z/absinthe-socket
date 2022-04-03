import type { Observable } from 'relay-runtime';

import subscriptions from './subscriptions';

/**
 * Returns a promise that resolves to `true` in case subscription of given
 * observable has started or to `false` otherwise
 */
const isSubscribed = (observable: Observable<any>): Promise<boolean> => {
  const maybeSubscription = subscriptions.get(observable);

  return maybeSubscription ? maybeSubscription.then(() => true).catch(() => false) : Promise.resolve(false);
};

export default isSubscribed;
