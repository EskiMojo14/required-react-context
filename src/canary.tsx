/// <reference types="react/canary" />
import type { Context } from "react";
import { use as originalUse } from "react";
import type { RequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import type { OneOf } from "./util";
import { notSet } from ".";

export function use<T>(
  context: OneOf<RequiredContext<T> | Context<T | typeof UNSET_VALUE>>,
): T {
  const value = originalUse(context);
  if (value === UNSET_VALUE) {
    throw new Error(
      notSet(
        "use",
        context.providerName ?? `${context.displayName ?? "Unknown"}.Provider`,
      ),
    );
  }
  return value;
}
