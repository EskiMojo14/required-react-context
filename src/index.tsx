import type { PropsWithChildren, ConsumerProps } from "react";
import React, { createContext, useContext, useDebugValue } from "react";
import type { Names, NamedRequiredContext } from "./types";
import { UNSET_VALUE } from "./types";
import { assert, capitalise } from "./util";

export { UNSET_VALUE };

const notSet = (caller: string, providerName: string) =>
  `${caller}: context value is not set. Use ${providerName} to set the value.`;

export function createRequiredContext<T>() {
  return {
    with: <const N extends Names>({
      name,
      contextName = `${capitalise(name)}Context`,
      providerName = `${capitalise(name)}Provider`,
      consumerName = `${capitalise(name)}Consumer`,
      hookName = `use${capitalise(name)}`,
      providerProp = name,
    }: N): NamedRequiredContext<T, N> => {
      for (const [name, value] of Object.entries({
        contextName,
        providerName,
        consumerName,
        hookName,
        providerProp,
      })) {
        assert(
          typeof value === "string",
          `createRequiredContext: Expected ${name} to be a string. Got: ${typeof value}`,
        );
      }
      assert(
        hookName.startsWith("use"),
        `createRequiredContext: hookName must start with "use". Got: ${hookName}`,
      );
      const Context = createContext<T | typeof UNSET_VALUE>(UNSET_VALUE);
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
        [consumerName](props: ConsumerProps<T>) {
          return (
            <Context.Consumer>
              {(value) => {
                assert(
                  value !== UNSET_VALUE,
                  notSet(consumerName, providerName),
                );
                return props.children(value);
              }}
            </Context.Consumer>
          );
        },
        [hookName]() {
          const value = useContext(Context);
          assert(value !== UNSET_VALUE, notSet(hookName, providerName));
          useDebugValue(value);
          return value;
        },
      } as never;
    },
  };
}
