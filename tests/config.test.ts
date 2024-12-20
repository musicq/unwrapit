import './helper'
import {panic} from 'panicit'
import {defineUnwrapitConfig, err, setPanic} from '../src'
import {type WrapConfig} from '../src/config'

describe('config', () => {
  describe('define global wrap config', () => {
    class MyError extends Error {}
    const myPanic: WrapConfig['panicFn'] = (msg: string) => {
      throw new MyError(msg)
    }

    test('defineWrapConfig > panicFn', () => {
      defineUnwrapitConfig({panicFn: myPanic})

      try {
        err('error').unwrap()
      } catch (e) {
        expect(e).toBeInstanceOf(MyError)
        expect(e.message).toBe('error')
      }
    })

    test('defineWrapConfig > panic', () => {
      defineUnwrapitConfig({panic: true})

      try {
        err('error').unwrap()
      } catch (e) {
        expect(panic).toHaveBeenCalledOnce()
        expect(panic).toBeCalledWith(
          'error',
          expect.objectContaining({exit: true})
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
