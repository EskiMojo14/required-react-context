/// <reference types="react/canary" />
import type { Context, Usable } from "react";
import { use as originalUse } from "react";
import type { RequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import type { OneOf } from "./util";
import { notSet } from ".";

function getProviderName(
  context: OneOf<RequiredContext<any> | Context<any>>,
): string {
  return context.providerName ?? `${context.displayName ?? "Unknown"}.Provider`;
}

export function use<T>(
  usable: RequiredContext<T> | Usable<T | typeof UNSET_VALUE>,
): T {
  const value = originalUse(usable);
  if (value === UNSET_VALUE) {
    throw new Error(
      "then" in usable
        ? "thenable returned UNSET_VALUE"
        : notSet("use", getProviderName(usable)),
    );
  }
  return value;
}
