# @absinthe/socket

> Absinthe Socket

- [Features](#features)
- [Installation](#installation)
  - [Using npm](#using-npm)
  - [Using yarn](#using-yarn)
- [Types](#types)
- [API](#api)
  - [cancel](#cancel)
    - [Parameters](#parameters)
    - [Examples](#examples)
  - [create](#create)
    - [Parameters](#parameters-1)
    - [Examples](#examples-1)
  - [observe](#observe)
    - [Parameters](#parameters-2)
    - [Examples](#examples-2)
  - [send](#send)
    - [Parameters](#parameters-3)
    - [Examples](#examples-3)
  - [toObservable](#toobservable)
    - [Parameters](#parameters-4)
    - [Examples](#examples-4)
  - [unobserve](#unobserve)
    - [Parameters](#parameters-5)
    - [Examples](#examples-5)
  - [unobserveOrCancel](#unobserveorcancel)
    - [Parameters](#parameters-6)
    - [Examples](#examples-6)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

- Immutable functional API
  > All received and returned objects with the exception of AbsintheSocket
  > instances (there are plans to make this immutable too) are treated in an
  > immutable way. Objects have no methods and instead we provide independent
  > stateless functions to interact with them.
- Lazy connect / join
  > If provided phoenix socket instance is not connected, then instead of
  > connecting at creation time, connection will be established on the next
  > invocation of [send](#send).
- Handle pending operations on connection lost
  > Pending mutations will be aborted, queries will be resent, and subscriptions
  > reestablished.
- Cancellable requests
  > Calling [cancel](#cancel) removes given notifier from absintheSocket instance
  > and sends a Cancel event to all its observers and unsubscribes in case it
  > holds a subscription request.
- Operations deduplication
  > If an already sent request is given to [send](#send), then instead of sending
  > it again, the notifier associated with it will be returned.
- Observer support of recoverable errors
  > Since connection lost is handled, then two events needs to exist to represent
  > this fact: Error (recoverable), Abort (unrecoverable).
- Multiple observers per request
  > Calling [send](#send) returns a notifier which allows attaching any number of
  > observers that will be notified when result arrives.
- Observer interaction depending on operation type
  > For the case of subscriptions, _Start_ event is dispatched when the
  > subscription is established, while for the other types
  > (queries and mutations), when the request is sent.

## Installation

### Using [npm](https://docs.npmjs.com/cli/npm)

    $ npm install --save phoenix @absinthe/socket

### Using [yarn](https://yarnpkg.com)

    $ yarn add phoenix @absinthe/socket

## Types

```typescript
// from @jumpn/utils-graphql
type EmptyObject = Record<never, never>;

// from @jumpn/utils-graphql
interface GqlErrorLocation {
  line: number,
  column: number
};

// from @jumpn/utils-graphql
interface GqlError {
  message: string,
  locations?: GqlErrorLocation[]
};

// from @jumpn/utils-graphql
interface GqlRequest<Variables extends void | EmptyObject = void>  {
  operation: string,
  variables?: Variables
};

// from @jumpn/utils-graphql
interface GqlRequestCompat<Variables extends void | EmptyObject = void> {
  query: string,
  variables?: Variables
};

// from @jumpn/utils-graphql
interface GqlResponse<Data> {
  data?: Data,
  errors?: GqlError[]
};

// from @jumpn/utils-graphql
type GqlOperationType = "mutation" | "query" | "subscription";

enum RequestStatus {
  SENT = "sent",
  PENDING = "pending",
  sending = "sending",
  CANCELED = "canceled",
  CANCELING = "canceling",
};

interface Observer<Result, Variables extends void | EmptyObject = void>  {
  onAbort?: (error: Error) => void,
  onError?: (error: Error) => void,
  onStart?: (notifier: Notifier<Result, Variables>) => void,
  onCancel?: () => void,
  onResult?: (result: Result) => void
};


interface Notifier<Result, Variables extends void | EmptyObject = void>  {
  request: GqlRequest<Variables>,
  isActive: boolean,
  requestStatus: RequestStatus,
  operationType: GqlOperationType,
  subscriptionId?: string
  activeObservers: ReadonlyArray<Observer<Result, Variables>>,
  canceledObservers: ReadonlyArray<Observer<Result, Variables>>,
};

interface AbsintheSocket {
  channel: Channel,
  notifiers: Notifier<any>[],
  phoenixSocket: PhoenixSocket
  channelJoinCreated: boolean,
};
```

## API

### cancel

Cancels a notifier sending a Cancel event to all its observers and
unsubscribing in case it holds a subscription request

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `notifier` **Notifier&lt;any, any>**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

absintheSocket.cancel(absintheSocket, notifier);
```

Returns **AbsintheSocket**

### create

Creates an Absinthe Socket using the given Phoenix Socket instance

#### Parameters

- `phoenixSocket` **PhoenixSocket**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';
import { value Socket as PhoenixSocket } from 'phoenix';

const absintheSocket = absintheSocket.create(new PhoenixSocket('ws://localhost:4000/socket'));
```

Returns **AbsintheSocket**

### observe

Observes given notifier using the provided observer

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `notifier` **Notifier&lt;Result, Variables>**
- `observer` **Observer&lt;Result, Variables>**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

const logEvent = (eventName: string) => (...args: unknown[]) => console.log(eventName, ...args);

const updatedNotifier = absintheSocket.observe(absintheSocket, notifier, {
  onAbort: logEvent('abort'),
  onError: logEvent('error'),
  onStart: logEvent('open'),
  onResult: logEvent('result'),
});
```

### send

Sends given request and returns an object (notifier) to track its progress
(see observe function)

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `request` **GqlRequest&lt;Variables>**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

const operation = `
  subscription userSubscription($userId: ID!) {
    user(userId: $userId) {
      id
      name
    }
  }
`;

const notifier = absintheSocket.send(absintheSocket, {
  operation,
  variables: { userId: 10 },
});
```

Returns **Notifier&lt;Result, Variables>**

### toObservable

Creates an Observable that will follow the given notifier

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `notifier` **Notifier&lt;Result, Variables>**
- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** (optional, default `{}`)
  - `options.unsubscribe` **function (): [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)?**
  - `options.onError` **function (error: [Error](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)): [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)?**
  - `options.onStart` **function (notifier: Notifier&lt;Result, Variables>): [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)?**
  - `options.handlers` **...any**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
  if (notifier && observer) {
    absintheSocket.unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const logEvent = (eventName) => (...args) => console.log(eventName, ...args);

const observable = absintheSocket.toObservable(absintheSocket, notifier, {
  onError: logEvent('error'),
  onStart: logEvent('open'),
  unsubscribe: unobserveOrCancelIfNeeded,
});
```

Returns **Observable**

### unobserve

Detaches observer from notifier

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `notifier` **Notifier&lt;any, any>**
- `observer` **Observer&lt;any, any>**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

absintheSocket.unobserve(absintheSocket, notifier, observer);
```

Returns **AbsintheSocket**

### unobserveOrCancel

Cancels notifier if there are no more observers apart from the one given, or
detaches given observer from notifier otherwise

#### Parameters

- `absintheSocket` **AbsintheSocket**
- `notifier` **Notifier&lt;Result, Variables>**
- `observer` **Observer&lt;Result, Variables>**

#### Examples

```typescript
import * as absintheSocket from '@absinthe/socket';

absintheSocket.unobserve(absintheSocket, notifier, observer);
```

## License

[MIT](LICENSE.txt) :copyright: Jumpn Limited.
