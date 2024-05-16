import './helper'
import {panic} from 'panicit'
import {err, ok} from '../src'

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
        expect.objectContaining({shouldExit: false})
      )
    })

    test('unwrap w/ panic', () => {
      const error = err('error')
      expect(error.unwrap({panic: true})).toBeUndefined()
      expect(panic).toBeCalledWith(
        'error',
        expect.objectContaining({shouldExit: true})
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
          shouldExit: false,
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
          shouldExit: true,
        })
      )
    })

    test('mapErr', () => {
      const success = ok(1)
      expect(success.mapErr(e => 2)).toBe(success)

      const error = err<string>('error')
      expect(error.mapErr(e => 2)).toStrictEqual(err(2))
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
})
