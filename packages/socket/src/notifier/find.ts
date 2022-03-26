import deepEqual from "fast-deep-equal";
import type {Notifier} from "./types";

const find = <Result extends Notifier<any, any>, Key extends keyof Result>(notifiers: Array<Notifier<any, any>>, key: Key, value: Result[Key]): null | Result  =>
  (notifiers.find(notifier => deepEqual(notifier[key as keyof Notifier<any, any>], value)) ?? null) as Result | null;

export default find;
