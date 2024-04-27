import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createRequiredContext } from "required-react-context";
import { use } from "required-react-context/canary";
import { ErrorBoundary } from "react-error-boundary";

const { CountProvider, useCount, CountContext } =
  createRequiredContext<number>().with({
    name: "count",
  });

function CurrentCount() {
  const count = useCount();
  return <p>count is {count}</p>;
}

function ConditionalRead({ inside }: { inside?: boolean }) {
  const [shouldRead, setShouldRead] = useState(false);
  if (shouldRead) {
    return (
      <>
        <p> count is {use(CountContext)}</p>
        <button onClick={() => setShouldRead(false)}>Stop reading count</button>
      </>
    );
  }
  return (
    <button onClick={() => setShouldRead(true)}>
      Read count {inside ? "inside" : "outside"} provider
    </button>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>
        {error instanceof Error ? error.message : String(error)}
      </pre>
      {error instanceof Error && error.stack && <pre>{error.stack}</pre>}
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [showBroken, setShowBroken] = useState(false);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setShowBroken(false)}
    >
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <CountProvider count={count}>
          <CurrentCount />
        </CountProvider>
        <button onClick={() => setCount((count) => count + 1)}>
          Increment
        </button>
        {showBroken && <CurrentCount />}
        <button onClick={() => setShowBroken(true)}>
          Show component outside of provider
        </button>
        <CountProvider count={count}>
          <ConditionalRead inside />
        </CountProvider>
        <ConditionalRead />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ErrorBoundary>
  );
}

export default App;
