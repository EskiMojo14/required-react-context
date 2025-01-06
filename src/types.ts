import type { PropsWithChildren, Context, FC, ConsumerProps } from "react";
import type { Compute } from "./util";

export const UNSET_VALUE = Symbol.for("required-react-context/unset-value");

export interface Names {
  name: string;
  contextName?: string;
  providerName?: string;
  providerProp?: string;
  consumerName?: string;
  hookName?: `use${string}`;
}

type GetName<
  N extends Names,
  K extends keyof Names,
  Fallback extends string,
> = N[K] extends string ? N[K] : Fallback;

type GetContextName<N extends Names> = GetName<
  N,
  "contextName",
  `${Capitalize<N["name"]>}Context`
>;

type GetProviderName<N extends Names> = GetName<
  N,
  "providerName",
  `${Capitalize<N["name"]>}Provider`
>;

type GetProviderProp<N extends Names> = GetName<N, "providerProp", N["name"]>;

type GetConsumerName<N extends Names> = GetName<
  N,
  "consumerName",
  `${Capitalize<N["name"]>}Consumer`
>;

type GetHookName<N extends Names> = GetName<
  N,
  "hookName",
  `use${Capitalize<N["name"]>}`
>;

export interface NamedContext<T> extends Context<T> {
  displayName: string;
  providerName: string;
}

export type NamedContextUtils<T, N extends Names, DefaultValue> = Compute<
  Record<GetContextName<N>, Context<T | DefaultValue>> &
    Record<
      GetProviderName<N>,
      FC<PropsWithChildren<Record<GetProviderProp<N>, T>>>
    > &
    Record<GetConsumerName<N>, FC<ConsumerProps<T>>> &
    Record<GetHookName<N>, () => T>
>;
