import {describe, expect, test} from 'vitest'
import {Err, err, Ok, ok, wrap} from '../src/result'

describe('result', () => {
  test('ok value should have value field', () => {
    const val = ok(1)

    expect(val.unwrap()).toBe(1)
    expect(val.ok).toBe(true)
    expect((val as Ok<number>).value).toBe(1)
  })

  test('err value should have error field', () => {
    const val = err('error')

    expect(() => val.unwrap()).toThrow(/error/)
    expect(val.ok).toBe(false)
    expect((val as Err<string>).error).toBe('error')
  })

  test('wrap a synchronous function', () => {
    const object = { package: 'unwrapit!' }
    const rawJson = JSON.stringify(object)

    let tryParseJson = wrap(() => JSON.parse(rawJson))

    let jsonWrapper = tryParseJson()
    expect(jsonWrapper.unwrap()).toStrictEqual(object)
    expect(jsonWrapper.ok).toBe(true)
    expect((jsonWrapper as Ok<typeof object>).value).toStrictEqual(object)

    tryParseJson = wrap(() => JSON.parse(`{"key": "some broken value'}`))
    jsonWrapper = tryParseJson()
    expect(() => jsonWrapper.unwrap()).toThrow()
    expect(jsonWrapper.ok).toBe(false)
    expect((jsonWrapper as Err<unknown>).error).toBeDefined()
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
    expect(handler.ok).toBe(true)
    expect((handler as Ok<string>).value).toBe('Yay')

    controller = false
    handler = await wrap(promise())
    expect(() => handler.unwrap()).toThrow(/Toggle is off\./)
    expect(handler.ok).toBe(false)
    expect((handler as Err<Error>).error).toMatch(/Toggle is off\./)
  })
})
