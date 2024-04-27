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
  usable:
    | NamedContext<T | typeof UNSET_VALUE>
    | Usable<T | typeof UNSET_VALUE>
    | Usable<T>,
): T {
  const value = originalUse(usable as Usable<T | typeof UNSET_VALUE>);
  assert(
    value !== UNSET_VALUE,
    "then" in usable
      ? "thenable returned UNSET_VALUE"
      : notSet("use", getProviderName(usable)),
  );
  return value;
}
