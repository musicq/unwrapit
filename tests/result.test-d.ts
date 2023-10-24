import {describe, expectTypeOf, test} from 'vitest'
import {Err, Ok, Result, WrapOption, err, ok, wrap} from '../src/result'
import {TF} from '../src/types'

describe('Result types test', () => {
  test('ok type', () => {
    expectTypeOf(ok).returns.toEqualTypeOf<Result<unknown, never>>()
    expectTypeOf(ok(1)).toEqualTypeOf<Result<number, never>>()
    expectTypeOf(ok('string')).toEqualTypeOf<Result<string, never>>()
    expectTypeOf(ok(1).unwrap).toMatchTypeOf<(opts?: WrapOption) => number>()
    expectTypeOf(ok(1).unwrapOr).toEqualTypeOf<(v: number) => number>()
    expectTypeOf(ok(1).unwrapOrElse(e => 'string')).toEqualTypeOf<
      string | number
    >()
    expectTypeOf(
      (ok(1) as Ok<number>).unwrapOrElse(e => '1')
    ).toEqualTypeOf<number>()
    expectTypeOf(ok(1).expect).toMatchTypeOf<
      (arg: string, opts?: WrapOption) => number
    >()
  })

  test('err type', () => {
    expectTypeOf(err).returns.toEqualTypeOf<Result<unknown, unknown>>()
    expectTypeOf(err(1)).toEqualTypeOf<Result<unknown, number>>()
    expectTypeOf(err('string')).toEqualTypeOf<Result<unknown, string>>()
    expectTypeOf(err(new Error())).toEqualTypeOf<Result<unknown, Error>>()
    expectTypeOf((err(1) as Err<number, string>).unwrap).toMatchTypeOf<
      (opts?: WrapOption) => never
    >()
    expectTypeOf((err(1) as Err<number, string>).unwrapOr).toEqualTypeOf<
      (v: string) => string
    >()
    expectTypeOf((err(1) as Err<number, string>).unwrapOrElse).toEqualTypeOf<
      <U>(mapFn: (e: number) => U) => U
    >()
    expectTypeOf((err(1) as Err<number, string>).expect).toMatchTypeOf<
      (errorMessage: string, opts?: WrapOption) => never
    >()
    expectTypeOf(err(1).mapErr).toMatchTypeOf<
      <U>(errMapFn: (e: number) => U) => Result<unknown, U>
    >()
  })

  describe('wrap type', () => {
    test('async functions', () => {
      async function foo(a: number, b: boolean): Promise<string> {
        return ''
      }

      expectTypeOf(wrap(foo)).toEqualTypeOf<
        (a: number, b: boolean) => Promise<Result<string, unknown>>
      >()
      expectTypeOf(wrap<Error, TF<typeof foo>>(foo)).toEqualTypeOf<
        (a: number, b: boolean) => Promise<Result<string, Error>>
      >()
    })

    test('sync functions', () => {
      function foo(a: number, b: boolean): string {
        return ''
      }

      expectTypeOf(wrap(foo)).toEqualTypeOf<
        (a: number, b: boolean) => Result<string, unknown>
      >()
      expectTypeOf(wrap<Error, TF<typeof foo>>(foo)).toEqualTypeOf<
        (a: number, b: boolean) => Result<string, Error>
      >()
    })

    test('promise values', () => {
      expectTypeOf(wrap(Promise.resolve(1))).toEqualTypeOf<
        Promise<Result<number, unknown>>
      >()
      expectTypeOf(wrap<Error, number>(Promise.resolve(1))).toEqualTypeOf<
        Promise<Result<number, Error>>
      >()
      expectTypeOf(wrap(Promise.reject(1))).toEqualTypeOf<
        Promise<Result<never, unknown>>
      >()
    })

    test('arbitrary values', () => {
      expectTypeOf(wrap(1)).toEqualTypeOf<Result<number, never>>()
      expectTypeOf(wrap('string')).toEqualTypeOf<Result<string, never>>()
      expectTypeOf(wrap([1, 2, 3])).toEqualTypeOf<Result<number[], never>>()
      expectTypeOf(wrap({a: 1, b: true})).toEqualTypeOf<
        Result<{a: number; b: boolean}, never>
      >()
      expectTypeOf(wrap(new Error())).toEqualTypeOf<Result<Error, never>>()

      // @ts-expect-error
      expectTypeOf(wrap<string>(1)).toEqualTypeOf<Result<string, never>>()
    })
  })
})
