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
            return function(t, e, n) {
                return new Error(t, e, n);
            };
        }
        constructor(e, n) {
            this.data = e;
            this.options = Object.assign({}, t.OPTIONS, n);
        }
        get(t, e = undefined) {
            const n = ("" + t).split(this.options.splitter);
            const i = n.shift();
            if (!(i in this.data)) {
                return e;
            }
            var r = this.data[i];
            for (var o = 0; o < n.length; o++) {
                const t = n[o];
                if ([ "object", "function" ].indexOf(typeof r) === -1 || !(t in r)) {
                    return e;
                }
                r = r[t];
            }
            return r;
        }
        set(t, e) {
            const n = ("" + t).split(this.options.splitter);
            var i = undefined;
            var r = undefined;
            var o = this.data;
            for (var s = 0; s < n.length; s++) {
                const t = n[s];
                if (s === n.length - 1) {
                    o[t] = e;
                } else if ([ "object", "function" ].indexOf(typeof o) !== -1 && t in o) {
                    i = o;
                    r = t;
                    o = o[t];
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
            var o = this.data;
            for (var s = 0; s < n.length; s++) {
                const t = n[s];
                const f = [ "object", "function", "string" ].indexOf(typeof o) !== -1;
                const d = s === n.length - 1;
                const a = f && t in o;
                if (!d) {
                    if (f && !a) {
                        i = o;
                        r = t;
                        o = o[t];
                    } else if (f && a) {
                        i = o;
                        r = t;
                        o = o[t];
                    } else if (!f) {
                        i[r] = {};
                        i[r][this.options.overridenProperty] = o;
                        i[r][t] = {};
                        o = i[r][t];
                        i = i[r];
                        r = t;
                    }
                } else if (d) {
                    if (f) {
                        o[t] = e;
                    } else if (!f) {
                        i[r] = {};
                        i[r][this.options.overridenProperty] = o;
                        i[r][t] = e;
                        o = i[r][t];
                    }
                }
            }
            return this;
        }
        iterate(e, n = undefined) {
            var i = [];
            if ([ "object", "function", "string" ].indexOf(typeof this.data) !== -1) {
                var r = 0;
                var o = n;
                var s = this.data;
                if (typeof s === "string") {
                    s = s.split("");
                }
                for (var f in s) {
                    var d = e(s[f], f, r++, o, s);
                    if (typeof d !== "undefined") {
                        o = d;
                    }
                }
                if (typeof o !== "undefined") {
                    return o;
                } else {
                    return this;
                }
            } else throw t.Error("NotIterableArgument", "Argument provided is not iterable", this.data);
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