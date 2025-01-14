import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createRequiredContext } from "required-react-context";
import { use } from "required-react-context/canary";
import "./App.css";

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
        <button
          type="button"
          onClick={() => {
            setShouldRead(false);
          }}
        >
          Stop reading count
        </button>
      </>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        setShouldRead(true);
      }}
    >
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
      <button type="button" onClick={resetErrorBoundary}>
        Reset
      </button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [showBroken, setShowBroken] = useState(false);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setShowBroken(false);
      }}
    >
      <div className="card">
        <CountProvider count={count}>
          <CurrentCount />
        </CountProvider>
        <button
          type="button"
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          Increment
        </button>
        {showBroken && <CurrentCount />}
        <button
          type="button"
          onClick={() => {
            setShowBroken(true);
          }}
        >
          Show component outside of provider
        </button>
        <CountProvider count={count}>
          <ConditionalRead inside />
        </CountProvider>
        <ConditionalRead />
      </div>
    </ErrorBoundary>
  );
}

export default App;
