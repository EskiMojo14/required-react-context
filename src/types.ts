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

export type NamedRequiredContext<T, N extends Names> = Compute<
  Record<GetContextName<N>, Context<T | typeof UNSET_VALUE>> &
    Record<
      GetProviderName<N>,
      FC<PropsWithChildren<Record<GetProviderProp<N>, T>>>
    > &
    Record<GetConsumerName<N>, FC<ConsumerProps<T>>> &
    Record<GetHookName<N>, () => T>
>;
