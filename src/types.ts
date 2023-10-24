/**
 * Alias for built-in `Parameters` type.
 */
export type TP<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

/**
 * Resolve the return type of a function, if the return type is a promise, then
 * resolve the promise type instead.
 *
 * # Example
 *
 * ```ts
 * declare function foo(a: number): string
 * declare function bar(a: number): Promise<string>
 *
 * type t1 = TR<typeof foo> // string
 * type t2 = TR<typeof bar> // string
 * ```
 */
export type TR<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R extends Promise<infer P>
    ? P
    : R
  : any

/**
 * Resolve the parameter type and return type of a function.
 *
 * # Example
 *
 * ```ts
 * declare function foo(a: number): string
 * type t1 = TF<typeof foo> // [[a: number], string]
 *
 * declare function bar(a: number): Promise<string>
 * type t2 = TF<typeof bar> // [[a: number], string]
 * ```
 */
export type TF<T extends (...args: any) => any> = [TP<T>, TR<T>]
