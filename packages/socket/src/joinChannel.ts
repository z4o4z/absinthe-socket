import handlePush from './handlePush';
import { createErrorEvent } from './notifier/event/eventCreators';
import notifierNotifyActive from './notifier/notifyActive';
import pushRequest from './pushRequest';
import type { AbsintheSocket } from './types';

const createChannelJoinError = (message: string) => new Error(`channel join: ${message}`);

const notifyErrorToAllActive = (absintheSocket: AbsintheSocket, errorMessage: string) =>
  absintheSocket.notifiers.forEach((notifier) =>
    notifierNotifyActive(notifier, createErrorEvent(createChannelJoinError(errorMessage))),
  );

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = (absintheSocket: AbsintheSocket) => ({
  onError: (errorMessage: string) => notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () => absintheSocket.notifiers.forEach((notifier) => pushRequest(absintheSocket, notifier)),

  onTimeout: () => notifyErrorToAllActive(absintheSocket, 'timeout'),
});

const joinChannel = (absintheSocket: AbsintheSocket) => {
  handlePush(absintheSocket.channel.join(), createChannelJoinHandler(absintheSocket));

  // eslint-disable-next-line no-param-reassign
  absintheSocket.channelJoinCreated = true;

  return absintheSocket;
};

export default joinChannel;
