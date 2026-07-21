import {wrapConfig} from './config'
import type {WrapOption} from './result'

export function shouldExit(opt?: WrapOption): boolean {
  if (opt?.panic !== undefined) {
    return opt.panic
  }

  return wrapConfig.panic
}

export function isPromiseLike(input: unknown): input is PromiseLike<unknown> {
  if (
    input === null ||
    (typeof input !== 'object' && typeof input !== 'function')
  ) {
    return false
  }

  return typeof (input as {then?: unknown}).then === 'function'
}
