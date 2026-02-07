import './helper'
import {panic} from 'panicit'
import {wrap} from '../src'

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
    expect((handler.error as Error).message).toMatch(/Toggle is off\./)
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

  describe('wrap curried version', () => {
    test('wrap<E>()(fn)', () => {
      const syncFn = (x: number) => x * 2
      const wrappedSync = wrap<Error>()(syncFn)

      const result = wrappedSync(5)
      expect(result.unwrap()).toBe(10)
    })

    test('wrap<E>()(asyncFn)', async () => {
      const asyncFn = async (x: number) => x * 2
      const wrappedAsync = wrap<Error>()(asyncFn)

      const result = await wrappedAsync(5)
      expect(result.unwrap()).toBe(10)
    })

    test('wrap<E>()(promise)', async () => {
      const result = await wrap<Error>()(Promise.resolve(42))
      expect(result.unwrap()).toBe(42)
    })

    test('wrap<E>()(value)', () => {
      const result = wrap<Error>()(42)
      expect(result.unwrap()).toBe(42)
    })

    test('handles errors', () => {
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
})
