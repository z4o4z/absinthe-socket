import type { Notifier } from '@absinthe/socket';
import type { GraphQLResponse, Observable } from 'relay-runtime';

const subscriptions: WeakMap<Observable<GraphQLResponse>, Promise<Notifier<any>>> = new WeakMap();

export default subscriptions;
