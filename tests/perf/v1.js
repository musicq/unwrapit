import {panic as B} from 'panicit'
import {panic as l} from 'panicit'
var t = {panic: !1, panicFn: l}
function c(r) {
  ;(t.panic = !!r.panic),
    typeof r.panicFn == 'function' && (t.panicFn = r.panicFn)
}
function x(r) {
  c({panicFn: r})
}
function i(r) {
  return r?.panic ?? t.panic ?? !1
}
function s(r) {
  return typeof r == 'object' && 'then' in r && typeof r.then == 'function'
}
function o(r) {
  return new u(r)
}
function a(r) {
  return new f(r)
}
var u = class {
    constructor(e) {
      this.value = e
    }
    ok = !0
    unwrap(e) {
      return this.value
    }
    unwrapOr(e) {
      return this.value
    }
    unwrapOrElse(e) {
      return this.value
    }
    expect(e, n) {
      return this.value
    }
    mapErr(e) {
      return this
    }
    match(e) {
      if ('Ok' in e) return e.Ok(this.value)
    }
  },
  f = class r {
    constructor(e) {
      this.error = e
    }
    ok = !1
    unwrap(e) {
      return t.panicFn(this.error, {shouldExit: i(e), exitCode: e?.exitCode})
    }
    unwrapOr(e) {
      return e
    }
    unwrapOrElse(e) {
      return e(this.error)
    }
    expect(e, n) {
      return t.panicFn(e, {
        cause: this.error,
        shouldExit: i(n),
        exitCode: n?.exitCode,
      })
    }
    mapErr(e) {
      return new r(e(this.error))
    }
    match(e) {
      if ('Err' in e) return e.Err(this.error)
    }
  }
function T(r) {
  return typeof r == 'function'
    ? (...e) => {
        try {
          let n = r(...e)
          return s(n) ? T(n) : o(n)
        } catch (n) {
          return a(n)
        }
      }
    : s(r)
      ? r.then(o).catch(a)
      : o(r)
}
import {Observable as m} from 'rxjs'
function E() {
  return r =>
    new m(e => {
      let n = r.subscribe({
        next(p) {
          e.next(o(p))
        },
        error(p) {
          e.next(a(p))
        },
        complete() {
          e.complete()
        },
      })
      return () => {
        n.unsubscribe()
      }
    })
}
export {
  c as defineWrapConfig,
  a as err,
  o as ok,
  B as panic,
  x as setPanic,
  E as toWrap,
  T as wrap,
}
