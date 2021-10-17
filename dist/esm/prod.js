import { createContext as e, useContext as t, useState as n, useMemo as r, useEffect as i } from "react";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var o = function() {
  return o = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    return e;
  }, o.apply(this, arguments);
};

function s(e, t, n, r) {
  return new (n || (n = Promise))((function(i, o) {
    function s(e) {
      try {
        a(r.next(e));
      } catch (e) {
        o(e);
      }
    }

    function l(e) {
      try {
        a(r.throw(e));
      } catch (e) {
        o(e);
      }
    }

    function a(e) {
      var t;
      e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
        e(t);
      }))).then(s, l);
    }

    a((r = r.apply(e, t || [])).next());
  }));
}

function l(e, t) {
  var n, r, i, o, s = {
    label: 0, sent: function() {
      if (1 & i[0]) throw i[1];
      return i[1];
    }, trys: [], ops: []
  };
  return o = {
    next: l(0),
    throw: l(1),
    return: l(2)
  }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
    return this;
  }), o;

  function l(o) {
    return function(l) {
      return function(o) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; s;) try {
          if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
          switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
            case 0:
            case 1:
              i = o;
              break;
            case 4:
              return s.label++, { value: o[1], done: !1 };
            case 5:
              s.label++, r = o[1], o = [0];
              continue;
            case 7:
              o = s.ops.pop(), s.trys.pop();
              continue;
            default:
              if (!(i = s.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                s = 0;
                continue;
              }
              if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                s.label = o[1];
                break;
              }
              if (6 === o[0] && s.label < i[1]) {
                s.label = i[1], i = o;
                break;
              }
              if (i && s.label < i[2]) {
                s.label = i[2], s.ops.push(o);
                break;
              }
              i[2] && s.ops.pop(), s.trys.pop();
              continue;
          }
          o = t.call(e, s);
        } catch (e) {
          o = [6, e], r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & o[0]) throw o[1];
        return { value: o[0] ? o[1] : void 0, done: !0 };
      }([o, l]);
    };
  }
}

function a(e, t, n) {
  if (n || 2 === arguments.length) for (var r, i = 0, o = t.length; i < o; i++) !r && i in t || (r || (r = Array.prototype.slice.call(t, 0, i)), r[i] = t[i]);
  return e.concat(r || Array.prototype.slice.call(t));
}

var u = e(null), c = function() {
  function e(e) {
    var t = this, n = e.name, r = e.value, i = void 0 === r ? "" : r, o = e.touched, s = void 0 !== o && o, l = e.error,
      a = void 0 === l ? "" : l, u = e.getForm;
    this.value = "", this.touched = !1, this.error = "", this.name = "", this.getForm = null, this.listeners = [], this.onChange = function(e) {
      t.set(e.target.value), t.getForm().options.validateOnChange && t.validate();
    }, this.onBlur = function() {
      t.setTouched(!0), t.getForm().options.validateOnBlur && t.validate();
    }, this.getInputField = function() {
      return { value: t.value, name: t.name, onChange: t.onChange, onBlur: t.onBlur };
    }, this.getSelectField = function() {
      return {
        value: t.value, name: t.name, onChange: function(e) {
          t.value = e, t.touched = !0, t.triggerListeners(), (t.getForm().options.validateOnChange || t.getForm().options.validateOnBlur) && t.validate();
        }, onBlur: t.onBlur
      };
    }, this.getForm = u, this.name = n, this.value = i, this.touched = s, this.error = a;
  }

  return e.prototype.setError = function(e) {
    this.error = e, this.triggerListeners();
  }, e.prototype.setTouched = function(e) {
    this.touched = e, this.triggerListeners();
  }, e.prototype.set = function(e) {
    this.value = e, this.triggerListeners();
  }, e.prototype.validate = function() {
    return s(this, void 0, void 0, (function() {
      var e, t;
      return l(this, (function(n) {
        switch (n.label) {
          case 0:
            if (!(e = this.getForm().validateSchema.fields[this.name])) return [2];
            n.label = 1;
          case 1:
            return n.trys.push([1, 3, , 4]), [4, e.validate(this.value)];
          case 2:
            return n.sent(), [3, 4];
          case 3:
            return t = n.sent(), this.setError(t.errors[0]), [3, 4];
          case 4:
            return [2];
        }
      }));
    }));
  }, e.prototype.triggerListeners = function() {
    var e = this;
    this.listeners.forEach((function(t) {
      return t(e);
    }));
  }, e;
}();

function f(e, t) {
  e.fields[t] || e._addField(t, new c({
    name: t, getForm: function() {
      return e;
    }, value: ""
  }));
}

function h(e, t) {
  return new Proxy(e, {
    get: function(n, r) {
      return "fields" === r || "f" === r ? new Proxy(e.fields, {
        get: function(e, n) {
          return function(e) {
            if (!t.includes(e)) throw new Error("You don't have access to field with name - " + e);
          }(n), e[n];
        }
      }) : { __proto__: n };
    }
  });
}

function d() {
  for (var e = [], o = 0; o < arguments.length; o++) e[o] = arguments[o];
  var s = t(u), l = n(null), c = l[1];
  r((function() {
    e.forEach((function(e) {
      f(s, e);
    }));
  }), e);
  var d = r((function() {
    return "development" === process.env.NODE_ENV ? h(s, e) : null;
  }), []);
  return i((function() {
    var t = function() {
      c({});
    };
    return 0 === e.length ? s._addGlobalListener(t) : e.forEach((function(e) {
      s.fields[e].listeners = a(a([], s.fields[e].listeners, !0), [t], !1);
    })), function() {
      0 === e.length ? s._addGlobalListener(t) : e.forEach((function(e) {
        s.fields[e].listeners = s.fields[e].listeners.filter((function(e) {
          return e !== t;
        }));
      }));
    };
  }), e), "development" === process.env.NODE_ENV ? d : s;
}

var v = function() {
  function e(e) {
    var t = this, n = e.initValues, r = e.validateSchema, i = e.options;
    this.options = {
      validateOnChange: !0,
      validateOnBlur: !0
    }, this.fields = {}, this.f = null, this.validateSchema = null, this.globalListeners = [], this.globalFieldListener = function(e) {
      t.globalListeners.forEach((function(t) {
        return t(e);
      }));
    }, this.f = this.fields, this.validateSchema = r, this.options = o(o({}, this.options), i), Object.entries(n).forEach((function(e) {
      var n = e[0], r = e[1];
      t.fields[n] = new c({
        name: n, value: r, getForm: function() {
          return t;
        }
      });
    }));
  }

  return e.prototype._addGlobalListener = function(e) {
    var t = this;
    0 === this.globalListeners.length && Object.values(this.fields).forEach((function(e) {
      e.listeners.push(t.globalFieldListener);
    })), this.globalListeners.push(e);
  }, e.prototype._removeGlobalListener = function(e) {
    var t = this;
    this.globalListeners = this.globalListeners.filter((function(t) {
      return e !== t;
    })), 0 === this.globalListeners.length && Object.values(this.fields).forEach((function(e) {
      e.listeners = e.listeners.filter((function(e) {
        return t.globalFieldListener !== e;
      }));
    }));
  }, e.prototype._addField = function(e, t) {
    this.fields[e] = t, this.globalListeners.length && this.fields[e].listeners.push(this.globalFieldListener);
  }, e.prototype.getValues = function() {
    return Object.entries(this.fields).reduce((function(e, t) {
      var n = t[0], r = t[1];
      return e[n] = r.value, e;
    }), {});
  }, e;
}();

function p(e) {
  return r((function() {
    return new v(e);
  }), []);
}

var g = u.Provider;
export { g as FfsProvider, d as useFfs, p as useGlobalFfs };
