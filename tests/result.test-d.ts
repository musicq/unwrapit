import {describe, expectTypeOf, test} from 'vitest'
import {Err, Ok, Result, WrapOption, err, ok, wrap} from '../src/result'

describe('Result types test', () => {
  test('ok type', () => {
    expectTypeOf(ok).returns.toEqualTypeOf<Result<unknown, never>>()
    expectTypeOf(ok(1)).toEqualTypeOf<Result<number, never>>()
    expectTypeOf(ok('string')).toEqualTypeOf<Result<string, never>>()
    expectTypeOf(ok(1).unwrap).toMatchTypeOf<(opts?: WrapOption) => number>()
    expectTypeOf(ok(1).unwrapOr).toEqualTypeOf<(v: number) => number>()
    expectTypeOf(ok(1).unwrapOrElse(e => 'string')).toEqualTypeOf<string | number>()
    expectTypeOf((ok(1) as Ok<number>).unwrapOrElse(e => '1')).toEqualTypeOf<number>()
    expectTypeOf(ok(1).expect).toMatchTypeOf<(arg: string, opts?: WrapOption) => number>()
  })

  test('err type', () => {
    expectTypeOf(err).returns.toEqualTypeOf<Result<unknown, unknown>>()
    expectTypeOf(err(1)).toEqualTypeOf<Result<unknown, number>>()
    expectTypeOf(err('string')).toEqualTypeOf<Result<unknown, string>>()
    expectTypeOf(err(new Error())).toEqualTypeOf<Result<unknown, Error>>()
    expectTypeOf((err(1) as Err<number, string>).unwrap).toMatchTypeOf<(opts?: WrapOption) => never>()
    expectTypeOf((err(1) as Err<number, string>).unwrapOr).toEqualTypeOf<(v: string) => string>()
    expectTypeOf((err(1) as Err<number, string>).unwrapOrElse).toEqualTypeOf<<U>(mapFn: (e: number) => U) => U>()
    expectTypeOf((err(1) as Err<number, string>).expect).toMatchTypeOf<(errorMessage: string, opts?: WrapOption) => never>()
    expectTypeOf(err(1).mapErr).toMatchTypeOf<<U>(errMapFn: (e: number) => U) => Result<unknown, U>>()
  })

  test('wrap type', () => {
    const sf1 = (): any => 1
    const sf2 = (): string => ''
    const sf3 = (a: number, b: boolean): any => 1
    const sf4 = (a: number, b: boolean): string => ''

    const af1 = async (): Promise<any> => {}
    const af2 = async (): Promise<string> => ''
    const af3 = async (a: number, b: boolean): Promise<any> => {}
    const af4 = async (a: number, b: boolean): Promise<string> => ''
    
    // implicitly infer
    expectTypeOf(wrap(sf1)).toEqualTypeOf<() => Result<any, unknown>>()
    expectTypeOf(wrap(sf2)).toEqualTypeOf<() => Result<string, unknown>>()
    expectTypeOf(wrap(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<any, unknown>>()
    expectTypeOf(wrap(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<string, unknown>>()

    expectTypeOf(wrap(af1)).toEqualTypeOf<() => Promise<Result<any, unknown>>>()
    expectTypeOf(wrap(af2)).toEqualTypeOf<() => Promise<Result<string, unknown>>>()
    expectTypeOf(wrap(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<any, unknown>>>()
    expectTypeOf(wrap(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, unknown>>>()

    // specify error type
    expectTypeOf(wrap<Error, typeof sf1>(sf1)).toEqualTypeOf<() => Result<any, Error>>()
    expectTypeOf(wrap<string[], typeof sf1>(sf1)).toEqualTypeOf<() => Result<any, string[]>>()
    expectTypeOf(wrap<Error, typeof sf2>(sf2)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf3>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<any, Error>>()
    expectTypeOf(wrap<Error, typeof sf4>(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()

    expectTypeOf(wrap<Error, typeof af1>(af1)).toEqualTypeOf<() => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<string[], typeof af1>(af1)).toEqualTypeOf<() => Promise<Result<any, string[]>>>()
    expectTypeOf(wrap<Error, typeof af2>(af2)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, typeof af3>(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<Error, typeof af4>(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, Error>>>()

    // specify error & return type
    expectTypeOf(wrap<Error, typeof sf1, number>(sf1)).toEqualTypeOf<() => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf1, string>(sf1)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf2, 'a'>(sf2)).toEqualTypeOf<() => Result<'a', Error>>()
    expectTypeOf(wrap<Error, typeof sf3, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf4, 'a'>(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<'a', Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf2, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf4, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()

    expectTypeOf(wrap<Error, typeof af1, Promise<number>>(af1)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af1, Promise<string>>(af1)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, typeof af2, Promise<'a'>>(af2)).toEqualTypeOf<() => Promise<Result<'a', Error>>>()
    expectTypeOf(wrap<Error, typeof af3, Promise<number>>(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af4, Promise<'a'>>(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<'a', Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af1, number>(af1)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af2, Promise<number>>(af2)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af4, Promise<number>>(af4)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
  })

  test('wrap arbitrary values', () => {
    expectTypeOf(wrap(Promise.resolve(1))).toEqualTypeOf<Promise<Result<number, unknown>>>()
    expectTypeOf(wrap<Error, number>(Promise.resolve(1))).toEqualTypeOf<Promise<Result<number, Error>>>()
    expectTypeOf(wrap(Promise.reject(1))).toEqualTypeOf<Promise<Result<never, unknown>>>()

    expectTypeOf(wrap(1)).toEqualTypeOf<Result<number, never>>()
    expectTypeOf(wrap('string')).toEqualTypeOf<Result<string, never>>()
    expectTypeOf(wrap([1, 2, 3])).toEqualTypeOf<Result<number[], never>>()
    expectTypeOf(wrap({a: 1, b: true})).toEqualTypeOf<Result<{a: number; b: boolean}, never>>()
    expectTypeOf(wrap(new Error())).toEqualTypeOf<Result<Error, never>>()

    // @ts-expect-error
    expectTypeOf(wrap<string>(1)).toEqualTypeOf<Result<string, never>>()
  })
})
