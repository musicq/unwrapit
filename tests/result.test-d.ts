import {describe, expectTypeOf, test} from 'vitest'
import {Result, WrapOption, err, ok, wrap} from '../src'
import type {Err, Ok} from '../src/result'

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
    expectTypeOf(ok(1).match).toMatchTypeOf<(handler: {Ok: (v: number) => number}) => number>()
    expectTypeOf(ok(1).match).toMatchTypeOf<(handler: {Err: (e: never) => number}) => number>()
    expectTypeOf(ok(1).match).toMatchTypeOf<(handler: {Ok: (v: number) => number, Err: (e: never) => number}) => number>()
    // @ts-expect-error
    expectTypeOf(ok(1).match).toMatchTypeOf<(handler: {}) => number>()
    // @ts-expect-error
    expectTypeOf(ok(1).match).toMatchTypeOf<() => number>()
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
    expectTypeOf(err<number, string>(1).match).toMatchTypeOf<(handler: {Ok: (v: string) => number}) => number>()
    expectTypeOf(err<number, string>(1).match).toMatchTypeOf<(handler: {Err: (e: number) => number}) => number>()
    expectTypeOf(err<number, string>(1).match).toMatchTypeOf<(handler: {Ok: (v: string) => number, Err: (e: number) => number}) => number>()
    // @ts-expect-error
    expectTypeOf(err<number, string>(1).match).toMatchTypeOf<(handler: {}) => number>()
    // @ts-expect-error
    expectTypeOf(err<number, string>(1).match).toMatchTypeOf<() => number>()
  })

  test('wrap type', () => {
    const sf1 = (): any => 1
    const sf2 = (): string => ''
    const sf3 = (a: number, b: boolean): any => 1
    const sf4 = (a: number, b: boolean): string => ''
    const sf5 = (): never => {throw new Error('some error')}
    const sf6 = (a: number, b: boolean): never => {throw new Error('some error')}
    const sf7 = (): never | number => {throw new Error('some error')}
    const sf8 = (a: number, b: boolean): never | number => {throw new Error('some error')}

    const af1 = async (): Promise<any> => {}
    const af2 = async (): Promise<string> => ''
    const af3 = async (a: number, b: boolean): Promise<any> => {}
    const af4 = async (a: number, b: boolean): Promise<string> => ''
    const af5 = async (): Promise<never> => {throw new Error('some error')}
    const af6 = async (a: number, b: boolean): Promise<never> => {throw new Error('some error')}
    const af7 = async (): Promise<never | number> => {throw new Error('some error')}
    const af8 = async (a: number, b: boolean): Promise<never | number> => {throw new Error('some error')}

    // implicitly infer
    expectTypeOf(wrap(sf1)).toEqualTypeOf<() => Result<any, unknown>>()
    expectTypeOf(wrap(sf2)).toEqualTypeOf<() => Result<string, unknown>>()
    expectTypeOf(wrap(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<any, unknown>>()
    expectTypeOf(wrap(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<string, unknown>>()
    expectTypeOf(wrap(sf5)).toEqualTypeOf<() => Result<never, unknown>>()
    expectTypeOf(wrap(sf6)).toEqualTypeOf<(a: number, b: boolean) => Result<never, unknown>>()
    expectTypeOf(wrap(sf7)).toEqualTypeOf<() => Result<never | number, unknown>>()
    expectTypeOf(wrap(sf8)).toEqualTypeOf<(a: number, b: boolean) => Result<never | number, unknown>>()
    
    expectTypeOf(wrap(af1)).toEqualTypeOf<() => Promise<Result<any, unknown>>>()
    expectTypeOf(wrap(af2)).toEqualTypeOf<() => Promise<Result<string, unknown>>>()
    expectTypeOf(wrap(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<any, unknown>>>()
    expectTypeOf(wrap(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, unknown>>>()
    expectTypeOf(wrap(af5)).toEqualTypeOf<() => Promise<Result<never, unknown>>>()
    expectTypeOf(wrap(af6)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<never, unknown>>>()
    expectTypeOf(wrap(af7)).toEqualTypeOf<() => Promise<Result<never | number, unknown>>>()
    expectTypeOf(wrap(af8)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<never | number, unknown>>>()

    // specify error type
    expectTypeOf(wrap<Error, typeof sf1>(sf1)).toEqualTypeOf<() => Result<any, Error>>()
    expectTypeOf(wrap<string[], typeof sf1>(sf1)).toEqualTypeOf<() => Result<any, string[]>>()
    expectTypeOf(wrap<Error, typeof sf2>(sf2)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf3>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<any, Error>>()
    expectTypeOf(wrap<Error, typeof sf4>(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf5>(sf5)).toEqualTypeOf<() => Result<never, Error>>()
    expectTypeOf(wrap<Error, typeof sf6>(sf6)).toEqualTypeOf<(a: number, b: boolean) => Result<never, Error>>()
    expectTypeOf(wrap<Error, typeof sf7>(sf7)).toEqualTypeOf<() => Result<never | number, Error>>()
    expectTypeOf(wrap<Error, typeof sf8>(sf8)).toEqualTypeOf<(a: number, b: boolean) => Result<never | number, Error>>()

    expectTypeOf(wrap<Error, typeof af1>(af1)).toEqualTypeOf<() => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<string[], typeof af1>(af1)).toEqualTypeOf<() => Promise<Result<any, string[]>>>()
    expectTypeOf(wrap<Error, typeof af2>(af2)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, typeof af3>(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<Error, typeof af4>(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, typeof af5>(af5)).toEqualTypeOf<() => Promise<Result<never, Error>>>()
    expectTypeOf(wrap<Error, typeof af6>(af6)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<never, Error>>>()
    expectTypeOf(wrap<Error, typeof af7>(af7)).toEqualTypeOf<() => Promise<Result<never | number, Error>>>()
    expectTypeOf(wrap<Error, typeof af8>(af8)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<never | number, Error>>>()

    // specify error & return type
    expectTypeOf(wrap<Error, typeof sf1, number>(sf1)).toEqualTypeOf<() => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf1, string>(sf1)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf2, 'a'>(sf2)).toEqualTypeOf<() => Result<'a', Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf2, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf3, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf4, 'a'>(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<'a', Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf4, number>(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf5, never>(sf5)).toEqualTypeOf<() => Result<never, Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf5, string>(sf5)).toEqualTypeOf<() => Result<string, Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf6, string>(sf6)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof sf7, number>(sf7)).toEqualTypeOf<() => Result<number, Error>>()
    expectTypeOf(wrap<Error, typeof sf8, number>(sf8)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof sf8, string>(sf8)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()

    expectTypeOf(wrap<Error, typeof af1, Promise<number>>(af1)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af1, Promise<string>>(af1)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af1, number>(af1)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af2, Promise<'a'>>(af2)).toEqualTypeOf<() => Promise<Result<'a', Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af2, Promise<number>>(af2)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af3, Promise<number>>(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af4, Promise<'a'>>(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<'a', Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af4, Promise<number>>(af4)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af5, Promise<never>>(af5)).toEqualTypeOf<() => Promise<Result<never, Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af5, Promise<string>>(af5)).toEqualTypeOf<() => Result<string, Error>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af6, Promise<string>>(af6)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()
    expectTypeOf(wrap<Error, typeof af7, Promise<number>>(af7)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, typeof af8, Promise<number>>(af8)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<number, Error>>>()
    // @ts-expect-error
    expectTypeOf(wrap<Error, typeof af8, string>(af8)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, Error>>>()
  })

  test('wrap curried version - wrap<E>()', () => {
    const sf1 = (): any => 1
    const sf2 = (): string => ''
    const sf3 = (a: number, b: boolean): any => 1
    const sf4 = (a: number, b: boolean): string => ''

    const af1 = async (): Promise<any> => {}
    const af2 = async (): Promise<string> => ''
    const af3 = async (a: number, b: boolean): Promise<any> => {}
    const af4 = async (a: number, b: boolean): Promise<string> => ''

    expectTypeOf(wrap<Error>()(sf1)).toEqualTypeOf<() => Result<any, Error>>()
    expectTypeOf(wrap<string[]>()(sf1)).toEqualTypeOf<() => Result<any, string[]>>()
    expectTypeOf(wrap<Error>()(sf2)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<Error>()(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<any, Error>>()
    expectTypeOf(wrap<Error>()(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<string, Error>>()

    expectTypeOf(wrap<Error>()(af1)).toEqualTypeOf<() => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<string[]>()(af1)).toEqualTypeOf<() => Promise<Result<any, string[]>>>()
    expectTypeOf(wrap<Error>()(af2)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error>()(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<any, Error>>>()
    expectTypeOf(wrap<Error>()(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<string, Error>>>()

    expectTypeOf(wrap<Error>()(Promise.resolve(1))).toEqualTypeOf<Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error>()(1)).toEqualTypeOf<Result<number, Error>>()
    expectTypeOf(wrap<Error>()('string')).toEqualTypeOf<Result<string, Error>>()
  })

  test('wrap curried version - wrap<E, Ok>()', () => {
    const sf1 = (): any => 1
    const sf2 = (): string => ''
    const sf3 = (a: number, b: boolean): any => 1
    const sf4 = (a: number, b: boolean): string => ''

    const af1 = async (): Promise<any> => {}
    const af2 = async (): Promise<string> => ''
    const af3 = async (a: number, b: boolean): Promise<any> => {}
    const af4 = async (a: number, b: boolean): Promise<string> => ''

    expectTypeOf(wrap<Error, number>()(sf1)).toEqualTypeOf<() => Result<number, Error>>()
    expectTypeOf(wrap<Error, string>()(sf1)).toEqualTypeOf<() => Result<string, Error>>()
    expectTypeOf(wrap<SyntaxError, Record<string, any>>()(sf1)).toEqualTypeOf<() => Result<Record<string, any>, SyntaxError>>()
    expectTypeOf(wrap<Error, 'a'>()(sf2)).toEqualTypeOf<() => Result<'a', Error>>()
    expectTypeOf(wrap<Error, number>()(sf3)).toEqualTypeOf<(a: number, b: boolean) => Result<number, Error>>()
    expectTypeOf(wrap<Error, 'a'>()(sf4)).toEqualTypeOf<(a: number, b: boolean) => Result<'a', Error>>()

    expectTypeOf(wrap<Error, number>()(af1)).toEqualTypeOf<() => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, string>()(af1)).toEqualTypeOf<() => Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, 'a'>()(af2)).toEqualTypeOf<() => Promise<Result<'a', Error>>>()
    expectTypeOf(wrap<Error, number>()(af3)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<number, Error>>>()
    expectTypeOf(wrap<Error, 'a'>()(af4)).toEqualTypeOf<(a: number, b: boolean) => Promise<Result<'a', Error>>>()

    expectTypeOf(wrap<Error, string>()(Promise.resolve(1))).toEqualTypeOf<Promise<Result<string, Error>>>()
    expectTypeOf(wrap<Error, string>()(1)).toEqualTypeOf<Result<string, Error>>()
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
