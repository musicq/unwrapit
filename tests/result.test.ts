import {panic} from 'panicit'
import {afterEach, describe, expect, test, vi} from 'vitest'
import {err, ok, wrap} from '../src/result'

vi.mock('panicit', async () => {
  const mod = await vi.importActual('panicit')
  return {
    ...(mod as typeof import('panicit')),
    panic: vi.fn(),
  }
})

describe('result', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

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

  describe('unwrap methods', () => {
    test('unwrap', () => {
      const success = ok(1)
      expect(success.unwrap()).toBe(1)
      expect(panic).not.toHaveBeenCalled()

      const error = err('error')
      expect(error.unwrap()).toBeUndefined()
      expect(panic).toHaveBeenCalledOnce()
      expect(panic).toBeCalledWith(
        'error',
        expect.objectContaining({ shouldExit: true })
      )
    })

    test('unwrap w/o panic', () => {
      const error = err('error')
      expect(error.unwrap({ panic: false })).toBeUndefined()
      expect(panic).toBeCalledWith(
        'error',
        expect.objectContaining({ shouldExit: false })
      )
    })

    test('unwrapOr', () => {
      const success = ok(1)
      expect(success.unwrapOr(2)).toBe(1)

      const error = err<string, number>('error')
      expect(error.unwrapOr(1)).toBe(1)
      expect(panic).not.toHaveBeenCalledOnce()
    })

    test('expect', () => {
      const success = ok(1)
      expect(success.expect('never reach')).toBe(1)

      const error = err<string>('error')
      expect(error.expect('error message')).toBeUndefined()
      expect(panic).toHaveBeenCalledOnce()
      expect(panic).toBeCalledWith(
        'error message',
        expect.objectContaining({
          cause: 'error',
          shouldExit: true,
        })
      )
    })

    test('expect w/o panic', () => {
      const error = err('error')
      expect(error.expect('error message', { panic: false })).toBeUndefined()
      expect(panic).toBeCalledWith(
        'error message',
        expect.objectContaining({
          cause: 'error',
          shouldExit: false,
        })
      )
    })
  })

  describe('wrap function', () => {
    test('wrap a synchronous function', () => {
      const object = { package: 'unwrapit!' }
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
  })
})
