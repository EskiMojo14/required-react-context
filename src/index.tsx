import type { PropsWithChildren } from "react";
import React, { createContext, useContext, useDebugValue } from "react";
import type { Names, NamedRequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import { capitalise } from "./util";

export { UNSET_VALUE };

const notSet = (caller: string, providerName: string) =>
  `${caller}: context value is not set. Use ${providerName} to set the value.`;

export function createRequiredContext<T>() {
  const Context = createContext<T | typeof UNSET_VALUE>(UNSET_VALUE);
  return {
    with: <const N extends Names>({
      name,
      contextName = `${capitalise(name)}Context`,
      providerName = `${capitalise(name)}Provider`,
      consumerName = `${capitalise(name)}Consumer`,
      hookName = `use${capitalise(name)}`,
      providerProp = name,
    }: N): NamedRequiredContext<T, N> => {
      Context.displayName = contextName;
      return {
        [contextName]: Context,
        [providerName](props: PropsWithChildren<Record<string, T>>) {
          return (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <Context.Provider value={props[providerProp]!}>
              {props.children}
            </Context.Provider>
          );
        },
        [consumerName](props: { children: (value: T) => React.ReactNode }) {
          return (
            <Context.Consumer>
              {(value) => {
                if (value === UNSET_VALUE) {
                  throw new Error(notSet(consumerName, providerName));
                }
                return props.children(value);
              }}
            </Context.Consumer>
          );
        },
        [hookName]() {
          const value = useContext(Context);
          if (value === UNSET_VALUE) {
            throw new Error(notSet(hookName, providerName));
          }
          useDebugValue(value);
          return value;
        },
      } as never;
    },
  };
}
