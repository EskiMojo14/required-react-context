# required-react-context

A wrapper around React Context to require a value set with a Provider, throwing an error if used outside one. This avoids the often undesirable behavior of silently falling back to a default value.

```tsx
import { createRequiredContext } from "required-react-context";

export const { CountContext, useCount, CountProvider, CountConsumer } =
  createRequiredContext<number>().with({ name: "count" });

function Child() {
  // This will throw an error if used outside a CountProvider
  const count = useCount();
  return <div>{count}</div>;
}

function App() {
  return (
    <CountProvider count={5}>
      <Child />
    </CountProvider>
  );
}
```

The context is required to be given a name, which will be used to name the context hooks and components, and will appear in error messages and devtools.

Individual names can also be given to the hooks and components, which will be used in error messages (and devtools) instead of the defaults derived from the context name.

```tsx
import { createRequiredContext } from "required-react-context";

export const { ACountContext, useACount, ACountProvider, ACountConsumer } =
  createRequiredContext<number>().with({
    name: "count",
    // everything below is optional
    providerProp: "aCount",
    contextName: "ACountContext",
    hookName: "useACount",
    providerName: "ACountProvider",
    consumerName: "ACountConsumer",
  });

function Child() {
  // This will throw an error if used outside ACountProvider
  const count = useACount();
  return <div>{count}</div>;
}

function App() {
  return (
    <ACountProvider aCount={5}>
      <Child />
    </ACountProvider>
  );
}
```

Note that `hookName` is required to start with `"use"`, to match the React hook naming convention.

## `createOptionalContext`

While the main focus of this library is on contexts that require a Provider in the tree, we also recognise that there are valid use cases for a default value to be provided. We think that the naming behaviour of `createRequiredContext` is useful in general, so we provide a similar API for optional contexts.

```tsx
import { createOptionalContext } from "required-react-context";

const { CountContext, useCount, CountProvider, CountConsumer } =
  createOptionalContext<number>(0).with({ name: "count" }); // default value provided

function Child() {
  // This will not throw an error if used outside a CountProvider
  const count = useCount();
  return <div>{count.value}</div>;
}

function App() {
  return (
    <CountProvider count={5}>
      <Child />
    </CountProvider>
  );
}
```

## React Canary - `use`

Those who are using a canary version of React (either directly, or via a framework like Next.js) may be aware of the new [`use`](https://react.dev/reference/react/use) hook, which allows you to read a context conditionally.

This library exports a wrapped version of this `use` hook from the `/canary` entry point, which will throw an error if the context is not set. This can be useful for cases where you want to conditionally read a context, but still require it to be set.

```tsx
import { use } from "required-react-context/canary";

const { CountContext, CountProvider } = createRequiredContext<number>().with({
  name: "count",
});

function ConditionalCount({ show }: { show: boolean }) {
  if (show) {
    const count = use(CountContext); // will still throw if CountProvider is not set
    return <div>{count}</div>;
  }
  return null;
}
```

## Typescript

This package uses [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) from Typescript 5.0, so will not work properly with 4.9 or lower.

### Declaration files

Because the context uses a unique Symbol when unset, Typescript will struggle to create declaration files for the context. To work around this, you can either export only the hooks/consumer and provider, or import the `UNSET_VALUE` constant allowing Typescript to use it. Theoretically, you shouldn't need direct access to the context instance anyway, as the hooks and provider should be sufficient.

```ts
import { createRequiredContext } from "required-react-context";
// no context instance exported
export const { useCount, CountProvider, CountConsumer } =
  createRequiredContext<number>().with({ name: "count" });

// or

import { createRequiredContext, UNSET_VALUE } from "required-react-context";
// now able to export the context instance
export const { CountContext, useCount, CountProvider, CountConsumer } =
  createRequiredContext<number>().with({ name: "count" });
```

## Prior art

The idea of having a context that requires a value to be set is not unique by any means, but this library specifically takes a couple of cues from [@vtaits/react-required-context](https://www.npmjs.com/package/@vtaits/react-required-context), which provides a simpler (though less flexible) API.

```ts
import { createContext, useContext } from "@vtaits/react-required-context";

export const CountContext = createContext<number>();

export const useCount = () => useContext(CountContext);
```

The main advantage of this library is that it allows for more customization, such as naming the context, hooks, and components, and is careful to provide a good developer experience with helpful error messages and devtools integration.

This library also provides a `Consumer` component, which can be useful in rare cases, and is not provided by `@vtaits/react-required-context`. The hook form should still be preferred.
