import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense, useState } from "react";
import { describe, expect, it } from "vitest";
import { use } from "./canary";
import { wait } from "./util";
import { createRequiredContext } from ".";

describe("canary support", () => {
  describe("use", () => {
    const { TestContext, TestProvider } = createRequiredContext<string>().with({
      name: "test",
    });

    function TestComponent() {
      const value = use(TestContext);
      return <div>{value}</div>;
    }

    it("throws when value is not set", () => {
      expect(() =>
        render(<TestComponent />),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: use: context value is not set. Use TestProvider to set the value.]`,
      );
    });

    it("does not throw when value is set", () => {
      expect(() =>
        render(
          <TestProvider test="Hello">
            <TestComponent />
          </TestProvider>,
        ),
      ).not.toThrow();

      expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    const user = userEvent.setup();

    function Button() {
      const [clicked, setClicked] = useState(false);
      const text = clicked ? use(TestContext) : "Click me";
      return (
        <button
          type="button"
          onClick={() => {
            setClicked(true);
          }}
        >
          {text}
        </button>
      );
    }

    it("can be called conditionally", async () => {
      render(
        <TestProvider test="Clicked">
          <Button />
        </TestProvider>,
      );

      const button = screen.getByRole("button", { name: "Click me" });

      expect(button).toBeInTheDocument();

      await user.click(button);

      expect(button).toHaveTextContent("Clicked");
    });

    it("still throws if called conditionally", async () => {
      render(<Button />);

      const button = screen.getByRole("button", { name: "Click me" });

      expect(button).toBeInTheDocument();

      try {
        await user.click(button);

        expect.unreachable("Should throw");
      } catch (error) {
        expect(error).toMatchInlineSnapshot(
          `[Error: use: context value is not set. Use TestProvider to set the value.]`,
        );
      }
    });

    it("can be used normally with a promise", async () => {
      async function doSomethingAsync() {
        await wait(100);
        return "Resolved";
      }
      function AsyncComponent() {
        const text = use(doSomethingAsync());
        return <div>{text}</div>;
      }
      render(
        <Suspense fallback="Loading">
          <AsyncComponent />
        </Suspense>,
      );
      expect(screen.getByText("Loading")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Resolved")).toBeInTheDocument();
      });
    });
  });
});
