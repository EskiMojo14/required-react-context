// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Compute<T> = { [K in keyof T]: T[K] } & unknown;

type KeyofUnion<T> = T extends any ? keyof T : never;

export type OneOf<
  U,
  K extends KeyofUnion<U> = KeyofUnion<U>,
> = U extends infer T
  ? Compute<T & { [P in Exclude<K, keyof T>]?: undefined }>
  : never;

export function capitalise(str: string) {
  if (typeof str !== "string") return "";
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
