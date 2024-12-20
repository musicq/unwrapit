import {panic as B} from 'panicit'
import {panic as x} from 'panicit'
var t = {panic: !1, panicFn: x}
function i(e) {
  e.panic !== void 0 && (t.panic = !!e.panic),
    typeof e.panicFn == 'function' && (t.panicFn = e.panicFn)
}
var l = i
function m(e) {
  i({panicFn: e})
}
function s(e) {
  return e?.panic !== void 0 ? e.panic : t.panic
}
function u(e) {
  return e instanceof Promise
}
function o(e) {
  return new f(e)
}
function p(e) {
  return new c(e)
}
var f = class {
    constructor(r) {
      this.value = r
    }
    ok = !0
    unwrap(r) {
      return this.value
    }
    unwrapOr(r) {
      return this.value
    }
    unwrapOrElse(r) {
      return this.value
    }
    expect(r, n) {
      return this.value
    }
    mapErr(r) {
      return this
    }
    match(r) {
      if ('Ok' in r) return r.Ok(this.value)
    }
  },
  c = class e {
    constructor(r) {
      this.error = r
    }
    ok = !1
    unwrap(r) {
      return t.panicFn(this.error, {exit: s(r), exitCode: r?.exitCode})
    }
    unwrapOr(r) {
      return r
    }
    unwrapOrElse(r) {
      return r(this.error)
    }
    expect(r, n) {
      return t.panicFn(r, {
        cause: this.error,
        exit: s(n),
        exitCode: n?.exitCode,
      })
    }
    mapErr(r) {
      return new e(r(this.error))
    }
    match(r) {
      if ('Err' in r) return r.Err(this.error)
    }
  }
function T(e) {
  return typeof e == 'function'
    ? (...r) => {
        try {
          let n = e(...r)
          return u(n) ? T(n) : o(n)
        } catch (n) {
          return p(n)
        }
      }
    : u(e)
      ? e.then(o).catch(p)
      : o(e)
}
import {Observable as E} from 'rxjs'
function R() {
  return e =>
    new E(r => {
      let n = e.subscribe({
        next(a) {
          r.next(o(a))
        },
        error(a) {
          r.next(p(a))
        },
        complete() {
          r.complete()
        },
      })
      return () => {
        n.unsubscribe()
      }
    })
}
export {
  i as defineUnwrapitConfig,
  l as defineWrapConfig,
  p as err,
  o as ok,
  B as panic,
  m as setPanic,
  R as toWrap,
  T as wrap,
}
