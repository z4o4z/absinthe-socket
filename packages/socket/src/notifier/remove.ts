import findIndex from "./findIndex";

import type {Notifier} from "./types";

const remove = (notifier: Notifier<any, any>) => (
  notifiers: Notifier<any, any>[]
): Notifier<any, any>[] =>{
  const index = findIndex(notifiers, "request", notifier.request)

  if (index === -1) {
    return notifiers;
  }

  return [...notifiers.slice(0, index), ...notifiers.slice(index + 1)]
}

export default remove;
