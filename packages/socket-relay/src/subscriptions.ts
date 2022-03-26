import type { Notifier } from '@absinthe/socket';
import type { Disposable } from 'react-relay';

const subscriptions: WeakMap<Disposable, Promise<Notifier<any>>> = new WeakMap();

export default subscriptions;
