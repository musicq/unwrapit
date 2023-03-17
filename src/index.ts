export type Ok<T> = {
  ok: true
  value: T
  unwrap: () => T
}

export type Err<E = unknown> = {
  ok: false
  error: E
  unwrap: () => never
}

export type Result<T, E = unknown> = Ok<T> | Err<E>

export function wrap<TArgs extends any[], TReturn>(
  func: (...args: TArgs) => TReturn
): (...args: TArgs) => Result<TReturn>
export function wrap<T extends Promise<any>>(promise: T): Result<Awaited<T>>
export function wrap(input: any) {
  if (typeof input === 'function') {
    return (...args: any[]) => {
      try {
        return ok(input(...args))
      } catch (e) {
        return err(e)
      }
    }
  }

  return input.then(ok).catch(err)
}

export function err<T = unknown>(e: T): Err<T> {
  return {
    ok: false,
    error: e,
    unwrap() {
      console.error(e)
      throw e
    },
  }
}

export function ok<T>(v: T): Ok<T> {
  return {
    ok: true,
    value: v,
    unwrap() {
      return v
    },
  }
}
