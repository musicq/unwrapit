import {WrapConfig} from './config'
import type {WrapOption} from './result'

export function shouldExit(opt?: WrapOption): boolean {
  return opt?.panic ?? WrapConfig.panic ?? false
}

export function isPromiseLike(input: any): boolean {
  return (
    typeof input === 'object' &&
    'then' in input &&
    typeof input.then === 'function'
  )
}
