import type { PropsWithChildren, Context, FC } from "react";
import React, { createContext, useContext, useDebugValue } from "react";
import type { Compute } from "./util";
import { capitalise } from "./util";

const UNSET_VALUE = Symbol.for("required-react-context/unset-value");

export interface Names {
  name: string;
  contextName?: string;
  providerName?: string;
  providerProp?: string;
  consumerName?: string;
  hookName?: string;
}

type GetContextName<N extends Names> = N["contextName"] extends string
  ? N["contextName"]
  : `${Capitalize<N["name"]>}Context`;

type GetProviderName<N extends Names> = N["providerName"] extends string
  ? N["providerName"]
  : `${Capitalize<N["name"]>}Provider`;

type GetProviderProp<N extends Names> = N["providerProp"] extends string
  ? N["providerProp"]
  : N["name"];

type GetConsumerName<N extends Names> = N["consumerName"] extends string
  ? N["consumerName"]
  : `${Capitalize<N["name"]>}Consumer`;

type GetHookName<N extends Names> = N["hookName"] extends string
  ? N["hookName"]
  : `use${Capitalize<N["name"]>}`;

type NamedRequiredContext<T, N extends Names> = Compute<
  Record<GetContextName<N>, Context<T | typeof UNSET_VALUE>> &
    Record<
      GetProviderName<N>,
      FC<PropsWithChildren<Record<GetProviderProp<N>, T>>>
    > &
    Record<
      GetConsumerName<N>,
      FC<{ children: (value: T) => React.ReactNode }>
    > &
    Record<GetHookName<N>, () => T>
>;

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
