import type { PropsWithChildren, ConsumerProps } from "react";
import React, { createContext, useContext, useDebugValue } from "react";
import type { Names, NamedContext, NamedContextUtils } from "./types";
import { UNSET_VALUE } from "./types";
import { assert, capitalise } from "./util";

export { UNSET_VALUE };

export const notSet = (caller: string, providerName: string) =>
  `${caller}: context value is not set. Use ${providerName} to set the value.`;

const makeNamedContext = <T,>(
  defaultValue: T,
  {
    providerName,
    contextName,
  }: Required<Pick<Names, "contextName" | "providerName">>,
): NamedContext<T> =>
  Object.assign(createContext<T>(defaultValue), {
    providerName,
    displayName: contextName,
  });

const validateNames = (names: Names, caller: string) => {
  for (const [name, value] of Object.entries(names)) {
    assert(
      typeof value === "string",
      `${caller}: Expected ${name} to be a string. Got: ${typeof value}`,
    );
  }
  if (names.hookName) {
    assert(
      names.hookName.startsWith("use"),
      `${caller}: hookName must start with "use". Got: ${names.hookName}`,
    );
  }
};

const applyDefaultNames = ({
  name,
  contextName = `${capitalise(name)}Context`,
  providerName = `${capitalise(name)}Provider`,
  providerProp = name,
  consumerName = `${capitalise(name)}Consumer`,
  hookName = `use${capitalise(name)}`,
}: Names): Required<Names> => ({
  name,
  contextName,
  providerName,
  providerProp,
  consumerName,
  hookName,
});

export function createRequiredContext<T>(): {
  with: <const N extends Names>(
    names: N,
  ) => NamedContextUtils<T, N, typeof UNSET_VALUE>;
} {
  return {
    with(names) {
      validateNames(names, "createRequiredContext");

      const {
        contextName,
        providerName,
        providerProp,
        consumerName,
        hookName,
      } = applyDefaultNames(names);

      const Context = makeNamedContext<T | typeof UNSET_VALUE>(UNSET_VALUE, {
        providerName,
        contextName,
      });
      return {
        [contextName]: Context,
        [providerName](props: PropsWithChildren<Record<string, T>>) {
          return (
            <Context.Provider value={props[providerProp] as T}>
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

export function createOptionalContext<T>(defaultValue: T): {
  with: <const N extends Names>(names: N) => NamedContextUtils<T, N, T>;
} {
  return {
    with(names) {
      validateNames(names, "createOptionalContext");

      const {
        contextName,
        providerName,
        providerProp,
        consumerName,
        hookName,
      } = applyDefaultNames(names);

      const Context = makeNamedContext(defaultValue, {
        providerName,
        contextName,
      });
      return {
        [contextName]: Context,
        [providerName](props: PropsWithChildren<Record<string, T>>) {
          return (
            <Context.Provider value={props[providerProp] as T}>
              {props.children}
            </Context.Provider>
          );
        },
        [consumerName](props: ConsumerProps<T>) {
          return <Context.Consumer {...props} />;
        },
        [hookName]() {
          const value = useContext(Context);
          useDebugValue(value);
          return value;
        },
      } as never;
    },
  };
}
