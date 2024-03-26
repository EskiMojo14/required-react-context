/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { render, renderHook, screen } from "@testing-library/react";
import type { Context } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { createRequiredContext } from ".";

describe("createRequiredContext", () => {
  const aContextWithDisplayName = (displayName: string) =>
    expect.objectContaining<Context<number>>({
      Provider: expect.anything(),
      Consumer: expect.anything(),
      displayName,
    });
  it("creates a context and related utils", () => {
    const { TestContext, TestProvider, TestConsumer, useTest } =
      createRequiredContext<number>().with({ name: "Test" });

    expect(TestContext).toEqual(aContextWithDisplayName("TestContext"));

    expect(TestProvider).toBeTypeOf("function");

    expect(TestProvider.name).toBe("TestProvider");

    expect(TestConsumer).toBeTypeOf("function");

    expect(TestConsumer.name).toBe("TestConsumer");

    expect(useTest).toBeTypeOf("function");

    expect(useTest.name).toBe("useTest");
  });
  it("allows customising names", () => {
    const { CoolContext, CoolProvider, CoolConsumer, useCool } =
      createRequiredContext<number>().with({
        name: "Test",
        contextName: "CoolContext",
        providerName: "CoolProvider",
        consumerName: "CoolConsumer",
        hookName: "useCool",
      });

    expect(CoolContext).toEqual(aContextWithDisplayName("CoolContext"));

    expect(CoolProvider).toBeTypeOf("function");

    expect(CoolProvider.name).toBe("CoolProvider");

    expect(CoolConsumer).toBeTypeOf("function");

    expect(CoolConsumer.name).toBe("CoolConsumer");

    expect(useCool).toBeTypeOf("function");

    expect(useCool.name).toBe("useCool");
  });
  it("throws an error from a consumer if provider is not used", () => {
    const { TestConsumer, TestProvider } = createRequiredContext<number>().with(
      {
        name: "Test",
      },
    );

    const consume = vi.fn(() => "Find me");
    expect(() =>
      render(<TestConsumer>{consume}</TestConsumer>),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: TestConsumer: context value is not set. Use TestProvider to set the value.]`,
    );

    expect(consume).not.toHaveBeenCalled();

    expect(screen.queryByText("Find me")).not.toBeInTheDocument();

    expect(() =>
      render(
        <TestProvider value={1}>
          <TestConsumer>{consume}</TestConsumer>
        </TestProvider>,
      ),
    ).not.toThrow();

    expect(consume).toHaveBeenCalledWith(1);

    expect(screen.getByText("Find me")).toBeInTheDocument();
  });
  it("throws an error from a hook if provider is not used", () => {
    const { useContext, ContextProvider } =
      createRequiredContext<number>().with({
        name: "Context",
      });

    const consume = vi.fn();
    expect(() =>
      renderHook(() => consume(useContext())),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: useContext: context value is not set. Use ContextProvider to set the value.]`,
    );

    expect(consume).not.toHaveBeenCalled();

    expect(() =>
      renderHook(() => consume(useContext()), {
        wrapper: ({ children }) => (
          <ContextProvider value={1}>{children}</ContextProvider>
        ),
      }),
    ).not.toThrow();

    expect(consume).toHaveBeenCalledWith(1);
  });
});
