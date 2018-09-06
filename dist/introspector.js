(function(t, e) {
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = e;
    } else if (typeof define === "function" && typeof define.amd !== "undefined") {
        define([], () => e);
    } else {
        window[t] = e;
    }
})("IntrospectorAPI", function() {
    class t {
        static get OPTIONS() {
            return {
                splitter: ".",
                overridenProperty: "$"
            };
        }
        static get Error() {
            return class t extends Error {
                constructor(t, e, n) {
                    super({
                        name: t,
                        message: e,
                        data: n
                    });
                }
            };
        }
        constructor(e, n) {
            this.data = e;
            this.options = Object.assign({}, t.OPTIONS, n);
        }
        get(t, e = undefined) {
            const n = ("" + t).split(this.options.splitter);
            const i = n.shift();
            const r = typeof this.data === "string" && i in this.data.split("") || [ "object", "function" ].indexOf(typeof this.data) !== -1 && i in this.data;
            if (!r) {
                return e;
            }
            var s = this.data[i];
            for (var o = 0; o < n.length; o++) {
                const t = n[o];
                const i = typeof s === "string" && t in s.split("") || [ "object", "function" ].indexOf(typeof s) !== -1 && t in s;
                if (!i) {
                    return e;
                }
                s = s[t];
            }
            return s;
        }
        set(t, e) {
            const n = ("" + t).split(this.options.splitter);
            var i = undefined;
            var r = undefined;
            var s = this.data;
            for (var o = 0; o < n.length; o++) {
                const t = n[o];
                if (o === n.length - 1) {
                    s[t] = e;
                } else if ([ "object", "function", "string" ].indexOf(typeof s) !== -1 && t in s) {
                    i = s;
                    r = t;
                    s = s[t];
                } else {
                    return undefined;
                }
            }
            return this;
        }
        force(t, e) {
            const n = ("" + t).split(this.options.splitter);
            var i = undefined;
            var r = undefined;
            var s = this.data;
            for (var o = 0; o < n.length; o++) {
                const t = n[o];
                const f = [ "object", "function", "string" ].indexOf(typeof s) !== -1;
                const d = o === n.length - 1;
                const a = f && t in s;
                if (!d) {
                    if (f && !a) {
                        i = s;
                        r = t;
                        s = s[t];
                    } else if (f && a) {
                        i = s;
                        r = t;
                        s = s[t];
                    } else {
                        i[r] = {};
                        i[r][this.options.overridenProperty] = s;
                        i[r][t] = {};
                        s = i[r][t];
                        i = i[r];
                        r = t;
                    }
                } else {
                    if (f) {
                        s[t] = e;
                    } else {
                        i[r] = {};
                        i[r][this.options.overridenProperty] = s;
                        i[r][t] = e;
                        s = i[r][t];
                    }
                }
            }
            return this;
        }
        iterate(e, n = undefined) {
            var i = [];
            if ([ "object", "function", "string" ].indexOf(typeof this.data) !== -1) {
                var r = 0;
                var s = n;
                var o = this.data;
                if (typeof o === "string") {
                    o = o.split("");
                }
                for (var f in o) {
                    var d = e(o[f], f, r++, s, o);
                    if (typeof d !== "undefined") {
                        s = d;
                    }
                }
                if (typeof s !== "undefined") {
                    return s;
                } else {
                    return this;
                }
            } else throw new t.Error("NotIterableArgument", "Argument provided is not iterable", this.data);
        }
    }
    class e {
        static from(e, n = {}) {
            return new t(e, n);
        }
    }
    return {
        Introspector: e,
        Inspectable: t
    };
}());