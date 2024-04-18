// eslint-disable-next-line import/no-unresolved
/// <reference types="react/canary" />
import { use as originalUse } from "react";
import type { RequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import { notSet } from ".";

export function use<T>(context: RequiredContext<T>): T {
  const value = originalUse(context);
  if (value === UNSET_VALUE) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    throw new Error(notSet("use", context.providerName ?? "UnknownProvider"));
  }
  return value;
}
