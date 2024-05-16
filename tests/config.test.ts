import './helper'
import {panic} from 'panicit'
import {defineWrapConfig, err, setPanic} from '../src'
import {type TWrapConfig} from '../src/config'

describe('config', () => {
  describe('define global wrap config', () => {
    class MyError extends Error {}
    const myPanic: TWrapConfig['panicFn'] = (msg: string) => {
      throw new MyError(msg)
    }

    test('defineWrapConfig > panicFn', () => {
      defineWrapConfig({panicFn: myPanic})

      try {
        err('error').unwrap()
      } catch (e) {
        expect(e).toBeInstanceOf(MyError)
        expect(e.message).toBe('error')
      }
    })

    test('defineWrapConfig > panic', () => {
      defineWrapConfig({panic: true})

      try {
        err('error').unwrap()
      } catch (e) {
        expect(panic).toHaveBeenCalledOnce()
        expect(panic).toBeCalledWith(
          'error',
          expect.objectContaining({shouldExit: true})
        )
      }
    })

    test('setPanic', () => {
      setPanic(myPanic)

      try {
        err('error').unwrap()
      } catch (e) {
        expect(e).toBeInstanceOf(MyError)
        expect(e.message).toBe('error')
      }
    })
  })
})
