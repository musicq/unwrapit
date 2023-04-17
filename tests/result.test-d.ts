import {describe, expectTypeOf, test} from 'vitest'
import {Err, Ok, Result, err, ok, wrap} from '../src/result'

describe('Result types test', () => {
  test('ok type', () => {
    expectTypeOf(ok).returns.toMatchTypeOf<Result<unknown, never>>()
    expectTypeOf(ok(1)).toMatchTypeOf<Result<number, never>>()
    expectTypeOf(ok('string')).toMatchTypeOf<Result<string, never>>()
    expectTypeOf((ok(1) as Ok<number>).unwrap).toMatchTypeOf<() => number>()
    expectTypeOf((ok(1) as Ok<number>).unwrapOr).toMatchTypeOf<
      (v: number) => number
    >()
    expectTypeOf((ok(1) as Ok<number>).expect).toMatchTypeOf<
      (arg: string) => number
    >()
  })

  test('err type', () => {
    expectTypeOf(err).returns.toMatchTypeOf<Result<any, unknown>>()
    expectTypeOf(err(1)).toMatchTypeOf<Result<any, number>>()
    expectTypeOf(err('string')).toMatchTypeOf<Result<any, string>>()
    expectTypeOf(err(new Error())).toMatchTypeOf<Result<any, Error>>()
    expectTypeOf((err(1) as Err<unknown, number>).unwrap).toMatchTypeOf<
      () => never
    >()
    expectTypeOf((err(1) as Err<unknown, number>).unwrapOr).toMatchTypeOf<
      (v: number) => number
    >()
    expectTypeOf((err(1) as Err<unknown, number>).expect).toMatchTypeOf<
      (errorMessage: string) => never
    >()
  })

  test('wrap type', () => {
    // sync
    expectTypeOf(wrap(() => {})).toMatchTypeOf<() => Result<void, unknown>>()
    expectTypeOf(wrap((a: boolean) => 1)).toMatchTypeOf<
      (a: boolean) => Result<number, unknown>
    >()

    // async
    expectTypeOf(wrap(Promise.resolve('ok'))).toMatchTypeOf<
      Promise<Result<string, unknown>>
    >()
    expectTypeOf(wrap(Promise.reject('err'))).toMatchTypeOf<
      Promise<Result<never, unknown>>
    >()
  })
})
