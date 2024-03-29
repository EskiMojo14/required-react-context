/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { render, screen } from "@testing-library/react";
import type { Context } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { capitalise } from "./util";
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
      createRequiredContext<number>().with({ name: "test" });

    expect(TestContext).toEqual(aContextWithDisplayName("TestContext"));

    expect(TestProvider).toBeTypeOf("function");

    expect(TestProvider.name).toBe("TestProvider");

    expect(TestConsumer).toBeTypeOf("function");

    expect(TestConsumer.name).toBe("TestConsumer");

    expect(useTest).toBeTypeOf("function");

    expect(useTest.name).toBe("useTest");

    const consume = vi.fn();

    expect(() =>
      render(
        <TestProvider test={1}>
          <TestConsumer>{consume}</TestConsumer>
        </TestProvider>,
      ),
    ).not.toThrow();
  });
  it("allows customising names", () => {
    const { CoolContext, CoolProvider, CoolConsumer, useCool } =
      createRequiredContext<number>().with({
        name: "test",
        contextName: "CoolContext",
        providerName: "CoolProvider",
        providerProp: "coolValue",
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

    const consume = vi.fn();
    expect(() =>
      render(
        <CoolProvider coolValue={1}>
          <CoolConsumer>{consume}</CoolConsumer>
        </CoolProvider>,
      ),
    ).not.toThrow();

    expect(consume).toHaveBeenCalledWith(1);
  });
  it("throws an error from a consumer if provider is not used", () => {
    const { TestConsumer, TestProvider } = createRequiredContext<number>().with(
      {
        name: "test",
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
        <TestProvider test={1}>
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
        name: "context",
        providerProp: "value",
      });

    const consume = vi.fn();

    function TestComponent() {
      const value = useContext();
      consume(value);
      return <div>{value}</div>;
    }
    expect(() => render(<TestComponent />)).toThrowErrorMatchingInlineSnapshot(
      `[Error: useContext: context value is not set. Use ContextProvider to set the value.]`,
    );

    expect(consume).not.toHaveBeenCalled();

    expect(() =>
      render(
        <ContextProvider value={1}>
          <TestComponent />
        </ContextProvider>,
      ),
    ).not.toThrow();

    expect(consume).toHaveBeenCalledWith(1);

    expect(screen.getByText("1")).toBeInTheDocument();
  });
  it("can be wrapped to customise name scheme", () => {
    const typedCapitalise = capitalise as <T extends string>(
      str: T,
    ) => Capitalize<T>;
    const createAContext = <T,>() => ({
      withName: <Name extends string>(name: Name) =>
        createRequiredContext<T>().with({
          name,
          providerProp: `a${typedCapitalise(name)}` as const,
          contextName: `A${typedCapitalise(name)}Context` as const,
          providerName: `A${typedCapitalise(name)}Provider` as const,
          consumerName: `A${typedCapitalise(name)}Consumer` as const,
          hookName: `useA${typedCapitalise(name)}` as const,
        }),
    });

    const { ATestContext, ATestProvider, ATestConsumer, useATest } =
      createAContext<number>().withName("test");

    expect(ATestContext).toEqual(aContextWithDisplayName("ATestContext"));

    expect(ATestProvider).toBeTypeOf("function");

    expect(ATestProvider.name).toBe("ATestProvider");

    expect(ATestConsumer).toBeTypeOf("function");

    expect(ATestConsumer.name).toBe("ATestConsumer");

    expect(useATest).toBeTypeOf("function");

    expect(useATest.name).toBe("useATest");
  });
  it("errors if hookName starts with something other than use", () => {
    expect(() =>
      createRequiredContext<number>().with({
        name: "test",
        // @ts-expect-error Testing invalid input
        hookName: "getTest",
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: createRequiredContext: hookName must start with "use". Received: getTest]`,
    );
  });
  it("can be used as a factory", () => {
    const createNumberContext = createRequiredContext<number>();
    const { CountContext } = createNumberContext.with({ name: "count" });
    expect(CountContext).toEqual(aContextWithDisplayName("CountContext"));

    const { ACountContext } = createNumberContext.with({ name: "aCount" });
    expect(ACountContext).toEqual(aContextWithDisplayName("ACountContext"));

    // check that the context is not shared between the two
    expect(CountContext).toEqual(aContextWithDisplayName("CountContext"));
    expect(ACountContext).not.toBe(CountContext);
  });
});
