import {afterEach, expect, test, vi} from 'vitest'
import {panic} from '../src/panic'

const mockProcessExit = vi
  .spyOn(process, 'exit')
  .mockImplementation((() => {}) as any)
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

test('panic', () => {
  expect(() => panic('error message')).toThrowError(/error message/)
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(1)
  expect(mockConsoleError).toHaveBeenCalledOnce()
  expect(mockConsoleError).toBeCalledWith('error message')
})

test('panic with error code = 2 and error cause', () => {
  expect(() =>
    panic('error message', { exitCode: 2, cause: 'error cause' })
  ).toThrow(/error message/)
  expect(mockProcessExit).toHaveBeenCalledOnce()
  expect(mockProcessExit).toBeCalledWith(2)
  expect(mockConsoleError).toBeCalledTimes(2)
  expect(mockConsoleError).toBeCalledWith('error message')
  expect(mockConsoleError).toBeCalledWith('[Cause]', 'error cause')
})
