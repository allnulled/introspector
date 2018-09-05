(function(t, e) {
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = e;
    } else if (typeof define === "function" && typeof define.amd !== "undefined") {
        define([], () => e);
    } else {
        window[t] = e;
    }
})("Introspector", function() {
    class t {
        static get OPTIONS() {
            return {
                splitter: ".",
                overridenProperty: "$"
            };
        }
        constructor(e, n) {
            this.data = e;
            this.options = Object.assign({}, t.OPTIONS, n);
        }
        get(t, e = undefined) {
            const n = t.split(this.options.splitter);
            const i = n.shift();
            if (!(i in this.data)) {
                return e;
            }
            var o = this.data[i];
            for (var s = 0; s < n.length; s++) {
                const t = n[s];
                if ([ "object", "function" ].indexOf(typeof o) === -1 || !(t in o)) {
                    return e;
                }
                o = o[t];
            }
            return o;
        }
        set(t, e, n = false) {
            const i = t.split(this.options.splitter);
            var o = this.data;
            for (var s = 0; s < i.length; s++) {
                const r = i[s];
                if (s === i.length - 1) {
                    o[r] = n === false ? e : e(o[r], o, r, t);
                } else {
                    if ([ "object", "function" ].indexOf(typeof o) === -1 || !(r in o)) {
                        return;
                    }
                    o = o[r];
                }
            }
        }
        force(t, e, n = false) {
            const i = t.split(this.options.splitter);
            var o = this.data;
            for (var s = 0; s < i.length; s++) {
                const f = i[s];
                if (s === i.length - 1) {
                    o[f] = n === false ? e : e(o[f], o, f, t);
                } else {
                    if ([ "object", "function" ].indexOf(typeof o) === -1 || !(f in o)) {
                        var r = Object.assign(o);
                        o = {};
                        o[this.options.overridenProperty] = r;
                        o[f] = {};
                    }
                    o = o[f];
                }
            }
        }
    }
    class e {
        static from(e, n = {}) {
            return new t(e, n);
        }
    }
    return {
        Introspector: e
    };
}());