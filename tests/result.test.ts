import './helper'
import {panic} from 'panicit'
import {count, from, last, map, take} from 'rxjs'
import {err, ok, toWrap, wrap} from '../src'

describe('result', () => {
  describe('ok & err function', () => {
    test('ok value should have value field', () => {
      const val = ok(1)

      expect(val.unwrap()).toBe(1)

      if (!val.ok) {
        throw new Error('This line should never be reached.')
      }

      expect(val.ok).toBe(true)
      expect(val.value).toBe(1)
    })

    test('err value should have error field', () => {
      const val = err('error')

      if (val.ok) {
        throw new Error('This line should never be reached.')
      }

      val.unwrap()
      expect(panic).toHaveBeenCalledOnce()
      expect(val.ok).toBe(false)
      expect(val.error).toBe('error')
    })
  })

  describe('API tests', () => {
    test('unwrap', () => {
      const success = ok(1)
      expect(success.unwrap()).toBe(1)
      expect(panic).not.toHaveBeenCalled()

      const error = err('error')
      expect(error.unwrap()).toBeUndefined()
      expect(panic).toHaveBeenCalledOnce()
      expect(panic).toBeCalledWith(
        'error',
        expect.objectContaining({exit: false})
      )
    })

    test('unwrap w/ panic', () => {
      const error = err('error')
      expect(error.unwrap({panic: true})).toBeUndefined()
      expect(panic).toBeCalledWith(
        'error',
        expect.objectContaining({exit: true})
      )
    })

    test('unwrapOr', () => {
      const success = ok(1)
      expect(success.unwrapOr(2)).toBe(1)

      const error = err<string, number>('error')
      expect(error.unwrapOr(1)).toBe(1)
      expect(panic).not.toHaveBeenCalledOnce()
    })

    test('unwrapOrElse', () => {
      const success = ok(1)
      expect(success.unwrapOrElse(e => 2)).toBe(1)

      const error = err<string, number>('error')
      expect(error.unwrapOrElse(e => 2)).toBe(2)
      expect(panic).not.toHaveBeenCalledOnce()
    })

    test('expect', () => {
      const success = ok(1)
      expect(success.expect('never reach')).toBe(1)

      const error = err<string>('error')
      expect(error.expect('custom error message')).toBeUndefined()
      expect(panic).toHaveBeenCalledOnce()
      expect(panic).toBeCalledWith(
        'custom error message',
        expect.objectContaining({
          cause: 'error',
          exit: false,
        })
      )
    })

    test('expect w/ panic', () => {
      const error = err('error')
      expect(
        error.expect('custom error message', {panic: true})
      ).toBeUndefined()
      expect(panic).toBeCalledWith(
        'custom error message',
        expect.objectContaining({
          cause: 'error',
          exit: true,
        })
      )
    })

    test('mapErr', () => {
      const success = ok(1)
      expect(success.mapErr(e => 2)).toBe(success)

      const error = err<string>('error').mapErr(e => 2)
      expect(error).toStrictEqual(
        expect.objectContaining({ok: false, error: 2})
      )
    })

    test('match', () => {
      const success = ok(1)
      expect(success.match({Ok: v => v + 1})).toBe(2)
      expect(success.match({Ok: v => v + 1, Err: e => 1})).toBe(2)

      const error = err<string, number>('error')
      expect(error.match({Err: e => e.length})).toBe(5)
      expect(error.match({Ok: v => v, Err: e => 1})).toBe(1)
    })
  })

  describe('wrap function', () => {
    describe('wrap async/promise based functions', () => {
      async function testAsyncOrPromiseBasedFunction(
        fn: (...args: any[]) => Promise<any>
      ) {
        const asyncFnWrapper = wrap(fn)

        const okRet = await asyncFnWrapper(false)
        if (!okRet.ok) {
          throw new Error('This line should never be reached.')
        }

        expect(okRet.ok).toBe(true)
        expect(okRet.value).toBe('ok')

        const errRet = await asyncFnWrapper(true)
        if (errRet.ok) {
          throw new Error('This line should never be reached.')
        }

        expect(errRet.ok).toBe(false)
        expect((errRet.error as Error).message).toBe('async error')
      }

      test('wrap an async function', async () => {
        async function asyncFn(shouldThrow: boolean) {
          if (shouldThrow) throw new Error('async error')
          return 'ok'
        }

        await testAsyncOrPromiseBasedFunction(asyncFn)
      })

      test('wrap a promised based function', async () => {
        function promiseFn(shouldThrow: boolean) {
          return new Promise<string>((resolve, reject) => {
            if (shouldThrow) return reject(new Error('async error'))
            return resolve('ok')
          })
        }

        await testAsyncOrPromiseBasedFunction(promiseFn)
      })
    })

    test('wrap synchronous functions', () => {
      const object = {package: 'unwrapit!'}
      const rawJson = JSON.stringify(object)

      let tryParseJson = wrap(() => JSON.parse(rawJson))

      let jsonWrapper = tryParseJson()
      expect(jsonWrapper.unwrap()).toStrictEqual(object)
      if (!jsonWrapper.ok) {
        throw new Error('This line should never be reached.')
      }
      expect(jsonWrapper.ok).toBe(true)
      expect(jsonWrapper.value).toStrictEqual(object)

      tryParseJson = wrap(() => JSON.parse(`{"key": "some broken value'}`))
      jsonWrapper = tryParseJson()
      jsonWrapper.unwrap()
      expect(panic).toHaveBeenCalledOnce()
      if (jsonWrapper.ok) {
        throw new Error('This line should never be reached.')
      }
      expect(jsonWrapper.ok).toBe(false)
      expect(jsonWrapper.error).toBeDefined()
    })

    test('wrap throw functions', () => {
      const wrappedThrownFn = wrap<Error, any, never>((): never => {
        throw new Error('throw error')
      })

      const ret = wrappedThrownFn()
      if (ret.ok) {
        throw new Error('This line should never be reached.')
      }

      expect(ret.ok).toBe(false)
      expect(ret.error.message).toBe('throw error')
    })

    test('wrap a promise value', async () => {
      let controller = true
      const promise = () =>
        new Promise<string>((resolve, reject) => {
          if (controller) return resolve('Yay')
          return reject(new Error('Toggle is off.'))
        })

      let handler = await wrap(promise())
      expect(handler.unwrap()).toBe('Yay')
      if (!handler.ok) {
        throw new Error('This line should never be reached.')
      }
      expect(handler.ok).toBe(true)
      expect(handler.value).toBe('Yay')

      controller = false
      handler = await wrap(promise())
      handler.unwrap()
      expect(panic).toHaveBeenCalledOnce()
      if (handler.ok) {
        throw new Error('This line should never be reached.')
      }
      expect(handler.ok).toBe(false)
      expect(handler.error).toMatch(/Toggle is off\./)
    })

    test('wrap arbitrary value', () => {
      const r1 = wrap(1)
      const r2 = wrap('string')
      const r3 = wrap([1, 2, 3])
      const r4 = wrap({a: 1, b: true})

      expect(r1.unwrap()).toBe(1)
      expect(r2.unwrap()).toBe('string')
      expect(r3.unwrap()).toStrictEqual([1, 2, 3])
      expect(r4.unwrap()).toStrictEqual({a: 1, b: true})
    })

    test('wrap curried version - wrap<E>()(fn)', () => {
      const syncFn = (x: number) => x * 2
      const wrappedSync = wrap<Error>()(syncFn)

      const result = wrappedSync(5)
      expect(result.unwrap()).toBe(10)
    })

    test('wrap curried version - wrap<E>()(asyncFn)', async () => {
      const asyncFn = async (x: number) => x * 2
      const wrappedAsync = wrap<Error>()(asyncFn)

      const result = await wrappedAsync(5)
      expect(result.unwrap()).toBe(10)
    })

    test('wrap curried version - wrap<E>()(promise)', async () => {
      const result = await wrap<Error>()(Promise.resolve(42))
      expect(result.unwrap()).toBe(42)
    })

    test('wrap curried version - wrap<E>()(value)', () => {
      const result = wrap<Error>()(42)
      expect(result.unwrap()).toBe(42)
    })

    test('wrap curried version - handles errors', () => {
      const throwingFn = (): string => {
        throw new Error('test error')
      }
      const wrapped = wrap<Error>()(throwingFn)

      const result = wrapped()
      if (result.ok) {
        throw new Error('This line should never be reached.')
      }

      expect(result.ok).toBe(false)
      expect((result.error as Error).message).toBe('test error')
    })
  })

  describe('toWrap function', () => {
    test('convert value to Result', () => {
      const sub$ = from([1, 2, 3]).pipe(
        map(x => {
          if (x % 2 === 0) throw new Error(`num ${x} is even.`)
          return x
        }),
        toWrap()
      )

      sub$.pipe(take(1)).subscribe(x => {
        expect(x.unwrap()).toBe(1)
      })

      sub$.pipe(count()).subscribe(x => expect(x).toBe(2))

      sub$.pipe(last()).subscribe(x => {
        if (x.ok) {
          throw new Error('This line should never be reached.')
        }

        expect(x.error).toBe('num 2 is even.')
      })

      const complete$ = from([1, 2, 3]).pipe(toWrap())
      complete$.pipe(count()).subscribe(x => expect(x).toBe(3))
      complete$.subscribe({
        next: x => expect(x.ok).toBe(true),
        error: () => expect(false).toBe(true),
        complete: () => expect(true).toBe(true),
      })
    })
  })
})
