import type { GqlResponse } from '@absinthe/graphql-utils';

import { RequestStatus } from './notifier/constants';
import notifierNotifyResultEvent from './notifier/notifyResultEvent';
import notifierNotifyStartEvent from './notifier/notifyStartEvent';
import notifierRemove from './notifier/remove';
import type { Notifier } from './notifier/types';
import pushRequestUsing from './pushRequestUsing';
import refreshNotifier from './refreshNotifier';
import { subscribe } from './subscription';
import type { AbsintheSocket } from './types';
import updateNotifiers from './updateNotifiers';

const setNotifierRequestStatusSent = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
): Notifier<any, any> => refreshNotifier(absintheSocket, { ...notifier, requestStatus: RequestStatus.SENT });

const onQueryOrMutationSucceed = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  response: GqlResponse<any>,
): AbsintheSocket =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response)),
  );

const pushQueryOrMutation = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>): AbsintheSocket =>
  pushRequestUsing(absintheSocket, notifierNotifyStartEvent(notifier), onQueryOrMutationSucceed);

const pushRequest = (absintheSocket: AbsintheSocket, notifier: Notifier<any, any>) => {
  if (notifier.operationType === 'subscription') {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
};

export default pushRequest;
