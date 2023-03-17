import {describe, expectTypeOf, test} from 'vitest'
import {err, ok, Result, wrap} from '../src/result'

describe('Result types test', () => {
  test('ok type', () => {
    expectTypeOf(ok).returns.toMatchTypeOf<Result<unknown, never>>()
    expectTypeOf(ok(1)).toMatchTypeOf<Result<number, never>>()
    expectTypeOf(ok('string')).toMatchTypeOf<Result<string, never>>()
  })

  test('err type', () => {
    expectTypeOf(err).returns.toMatchTypeOf<Result<never, unknown>>()
    expectTypeOf(err(1)).toMatchTypeOf<Result<never, number>>()
    expectTypeOf(err('string')).toMatchTypeOf<Result<never, string>>()
    expectTypeOf(err(new Error())).toMatchTypeOf<Result<never, Error>>()
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
