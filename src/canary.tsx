/// <reference types="react/canary" />
import type { Context, Usable } from "react";
import { use as originalUse } from "react";
import type { NamedContext } from "./types";
import { UNSET_VALUE } from "./types";
import { assert, type OneOf } from "./util";
import { notSet } from ".";

function getProviderName(
  context: OneOf<NamedContext<any> | Context<any>>,
): string {
  return context.providerName ?? `${context.displayName ?? "Unknown"}.Provider`;
}

export function use<T>(
  usable: NamedContext<T> | Usable<T>,
): Exclude<T, typeof UNSET_VALUE> {
  const value = originalUse(usable);
  assert(
    value !== UNSET_VALUE,
    "then" in usable
      ? "thenable returned UNSET_VALUE"
      : notSet("use", getProviderName(usable)),
  );
  return value as never;
}
