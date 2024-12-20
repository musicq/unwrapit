import {wrapConfig} from './config'
import type {WrapOption} from './result'

export function shouldExit(opt?: WrapOption): boolean {
  if (opt?.panic !== undefined) {
    return opt.panic
  }

  return wrapConfig.panic
}

export function isPromise(input: any): boolean {
  return input instanceof Promise
}
