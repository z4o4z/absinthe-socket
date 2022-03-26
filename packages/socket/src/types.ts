import type { EmptyObject } from '@absinthe/graphql-utils';
import { Channel, Socket as PhoenixSocket } from 'phoenix';

import type { Notifier, Observer } from './notifier/types';

export interface AbsintheSocket {
  channel: Channel;
  notifiers: Notifier<any, any>[];
  phoenixSocket: PhoenixSocket;
  channelJoinCreated: boolean;
}

export interface PushHandler<Response extends EmptyObject> {
  onError: (errorMessage: string) => any;
  onSucceed: (response: Response) => any;
  onTimeout: () => any;
}

export interface NotifierPushHandler<Response extends EmptyObject> {
  onError: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, errorMessage: string) => any;
  onSucceed: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>, response: Response) => any;
  onTimeout: (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) => any;
}

export type { Observer };
