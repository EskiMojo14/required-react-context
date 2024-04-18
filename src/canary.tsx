/// <reference types="react/canary" />
import type { Usable } from "react";
import { use as originalUse } from "react";
import type { RequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import type { OneOf } from "./util";
import { notSet } from ".";

function getProviderName(
  usable: OneOf<RequiredContext<any> | Usable<any>>,
): string {
  return usable.providerName ?? `${usable.displayName ?? "Unknown"}.Provider`;
}

export function use<T>(
  usable: RequiredContext<T> | Usable<T | typeof UNSET_VALUE>,
): T {
  const value = originalUse(usable);
  if (value === UNSET_VALUE) {
    throw new Error(notSet("use", getProviderName(usable)));
  }
  return value;
}
