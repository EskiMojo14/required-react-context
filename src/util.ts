// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;

export function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function assert(
  condition: boolean,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === "string" ? message : message());
  }
}
