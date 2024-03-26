# required-react-context

A wrapper around React Context to require a value set with a Provider, throwing an error if used outside one. This avoids the often undesirable behavior of silently falling back to a default value.

```ts
import { createRequiredContext } from "required-react-context";

export const { CountContext, useCount, CountProvider, CountConsumer } =
  createRequiredContext<number>().with({ name: "Count" });

function Child() {
  // This will throw an error if used outside a CountProvider
  const count = useCount();
  return <div>{count}</div>;
}

function App() {
  return (
    <CountProvider value={5}>
      <Child />
    </CountProvider>
  );
}
```

The context is required to be given a name, which will be used to name the context hooks and components, and will appear in error messages and devtools.

Individual names can also be given to the hooks and components, which will be used in error messages (and devtools) instead of the defaults derived from the context name.

```ts
import { createRequiredContext } from "required-react-context";

export const { ACountContext, useACount, ACountProvider, ACountConsumer } =
  createRequiredContext<number>().with({
    name: "Count",
    contextName: "ACountContext",
    hookName: "useACount",
    providerName: "ACountProvider",
    consumerName: "ACountConsumer",
  });
```

## Typescript

This package uses [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) from Typescript 5.0, so will not work properly with 4.9 or lower.

## Prior art

The idea of having a context that requires a value to be set is not unique by any means, but this library specifically takes a couple of cues from [@vtaits/react-required-context](https://www.npmjs.com/package/@vtaits/react-required-context), which provides a simpler (though less flexible) API.

```ts
import { createContext, useContext } from "@vtaits/react-required-context";

export const CountContext = createContext<number>();

export const useCount = () => useContext(CountContext);
```

The main advantage of this library is that it allows for more customization, such as naming the context, hooks, and components, and is careful to provide a good developer experience with helpful error messages and devtools integration.

This library also provides a `Consumer` component, which can be useful in rare cases, and is not provided by `@vtaits/react-required-context`. The hook form should still be preferred.
