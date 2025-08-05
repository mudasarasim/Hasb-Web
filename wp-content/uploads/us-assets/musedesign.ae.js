! function($, _undefined) {
    "use strict";
    const _window = window;
    const _document = document;
    const _navigator = _window.navigator;
    const _location = _window.location;
    const max = Math.max;
    const min = Math.min;
    const pow = Math.pow;
    if ($.isPlainObject(_window.$ush)) {
        return
    }
    _window.$ush = {};
    var ua = _navigator.userAgent.toLowerCase(),
        base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        fromCharCode = String.fromCharCode;
    $ush.ua = ua;
    $ush.isMacOS = /(Mac|iPhone|iPod|iPad)/i.test(_navigator.platform);
    $ush.isFirefox = ua.indexOf('firefox') > -1;
    $ush.isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    $ush.isTouchend = ('ontouchend' in _document);
    $ush.safariVersion = function() {
        const self = this;
        if (self.isSafari) {
            return self.parseInt((ua.match(/version\/([\d]+)/i) || [])[1])
        }
        return 0
    }
    $ush.fn = function(fn) {
        if (typeof fn === 'function') {
            fn()
        }
    };
    $ush.isUndefined = function(value) {
        return '' + _undefined === '' + value
    };
    $ush.isRtl = function() {
        return this.toString(_document.body.className).split(/\p{Zs}/u).indexOf('rtl') > -1
    };
    $ush.isNode = function(node) {
        return !!node && node.nodeType
    };
    $ush.isNodeInViewport = function(node) {
        const self = this;
        const rect = $ush.$rect(node);
        const nearestTop = rect.top - _window.innerHeight;
        return nearestTop <= 0 && (rect.top + rect.height) >= 0
    };
    $ush.uniqid = function(prefix) {
        return (prefix || '') + Math.random().toString(36).substr(2, 9)
    };
    $ush.utf8Decode = function(data) {
        var tmp_arr = [],
            i = 0,
            ac = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;
        data += '';
        while (i < data.length) {
            c1 = data.charCodeAt(i);
            if (c1 < 128) {
                tmp_arr[ac++] = fromCharCode(c1);
                i++
            } else if (c1 > 191 && c1 < 224) {
                c2 = data.charCodeAt(i + 1);
                tmp_arr[ac++] = fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                i += 2
            } else {
                c2 = data.charCodeAt(i + 1);
                c3 = data.charCodeAt(i + 2);
                tmp_arr[ac++] = fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3
            }
        }
        return tmp_arr.join('')
    };
    $ush.utf8Encode = function(data) {
        if (data === null || this.isUndefined(data)) {
            return ''
        }
        var string = ('' + data),
            utftext = '',
            start, end, stringl = 0;
        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;
            if (c1 < 128) {
                end++
            } else if (c1 > 127 && c1 < 2048) {
                enc = fromCharCode((c1 >> 6) | 192) + fromCharCode((c1 & 63) | 128)
            } else {
                enc = fromCharCode((c1 >> 12) | 224) + fromCharCode(((c1 >> 6) & 63) | 128) + fromCharCode((c1 & 63) | 128)
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end)
                }
                utftext += enc;
                start = end = n + 1
            }
        }
        if (end > start) {
            utftext += string.slice(start, stringl)
        }
        return utftext
    };
    $ush.base64Decode = function(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [],
            self = this;
        if (!data) {
            return data
        }
        data += '';
        do {
            h1 = base64Chars.indexOf(data.charAt(i++));
            h2 = base64Chars.indexOf(data.charAt(i++));
            h3 = base64Chars.indexOf(data.charAt(i++));
            h4 = base64Chars.indexOf(data.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            if (h3 == 64) {
                tmp_arr[ac++] = fromCharCode(o1)
            } else if (h4 == 64) {
                tmp_arr[ac++] = fromCharCode(o1, o2)
            } else {
                tmp_arr[ac++] = fromCharCode(o1, o2, o3)
            }
        } while (i < data.length);
        return self.utf8Decode(tmp_arr.join(''))
    };
    $ush.base64Encode = function(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [],
            self = this;
        if (!data) {
            return data
        }
        data = self.utf8Encode('' + data);
        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
            bits = o1 << 16 | o2 << 8 | o3;
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
            tmp_arr[ac++] = base64Chars.charAt(h1) + base64Chars.charAt(h2) + base64Chars.charAt(h3) + base64Chars.charAt(h4)
        } while (i < data.length);
        enc = tmp_arr.join('');
        const r = data.length % 3;
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    };
    $ush.stripTags = function(input) {
        return $ush.toString(input).replace(/(<([^>]+)>)/ig, '').replace('"', '&quot;')
    };
    $ush.rawurldecode = function(str) {
        return decodeURIComponent('' + str)
    };
    $ush.rawurlencode = function(str) {
        return encodeURIComponent('' + str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
    };
    $ush.timeout = function(fn, delay) {
        var handle = {},
            start = new Date().getTime(),
            requestAnimationFrame = _window.requestAnimationFrame;

        function loop() {
            var current = new Date().getTime(),
                delta = current - start;
            delta >= delay ? fn.call() : handle.value = requestAnimationFrame(loop)
        }
        handle.value = requestAnimationFrame(loop);
        return handle
    };
    $ush.clearTimeout = function(handle) {
        if ($.isPlainObject(handle)) {
            handle = handle.value
        }
        if (typeof handle === 'number') {
            _window.cancelAnimationFrame(handle)
        }
    };
    $ush.throttle = function(fn, wait, no_trailing, debounce_mode) {
        const self = this;
        if (typeof fn !== 'function') {
            return $.noop
        }
        if (typeof wait !== 'number') {
            wait = 0
        }
        if (typeof no_trailing !== 'boolean') {
            no_trailing = _undefined
        }
        var last_exec = 0,
            timeout, context, args;
        return function() {
            context = this;
            args = arguments;
            var elapsed = +new Date() - last_exec;

            function exec() {
                last_exec = +new Date();
                fn.apply(context, args)
            }

            function clear() {
                timeout = _undefined
            }
            if (debounce_mode && !timeout) {
                exec()
            }
            timeout && self.clearTimeout(timeout);
            if (self.isUndefined(debounce_mode) && elapsed > wait) {
                exec()
            } else if (no_trailing !== !0) {
                timeout = self.timeout(debounce_mode ? clear : exec, self.isUndefined(debounce_mode) ? wait - elapsed : wait)
            }
        }
    };
    $ush.debounce = function(fn, wait, at_begin) {
        const self = this;
        return self.isUndefined(at_begin) ? self.throttle(fn, wait, _undefined, !1) : self.throttle(fn, wait, at_begin !== !1)
    };
    $ush.debounce_fn_1ms = $ush.debounce($ush.fn, 1);
    $ush.debounce_fn_10ms = $ush.debounce($ush.fn, 10);
    $ush.parseInt = function(value) {
        value = parseInt(value, );
        return !isNaN(value) ? value : 0
    };
    $ush.parseFloat = function(value) {
        value = parseFloat(value);
        return !isNaN(value) ? value : 0
    };
    $ush.limitValueByRange = function(value, minValue, maxValue) {
        return $ush.parseFloat(min(maxValue, max(minValue, value)))
    };
    $ush.toArray = function(data) {
        if (['string', 'number', 'bigint', 'boolean', 'symbol', 'function'].includes(typeof data)) {
            return [data]
        }
        try {
            data = [].slice.call(data || [])
        } catch (err) {
            console.error(err);
            data = []
        }
        return data
    };
    $ush.toString = function(value) {
        const self = this;
        if (self.isUndefined(value) || value === null) {
            return ''
        } else if ($.isPlainObject(value) || Array.isArray(value)) {
            return self.rawurlencode(JSON.stringify(value))
        }
        return '' + value
    };
    $ush.toPlainObject = function(value) {
        const self = this;
        try {
            value = JSON.parse(self.rawurldecode('' + value) || '{}')
        } catch (err) {}
        if (!$.isPlainObject(value)) {
            value = {}
        }
        return value
    };
    $ush.toLowerCase = function(value) {
        return ('' + value).toLowerCase()
    };
    $ush.clone = function(_object, _default) {
        return $.extend(!0, {}, _default || {}, _object || {})
    };
    $ush.escapePcre = function(value) {
        return this.toString(value).replace(/[.*+?^${}()|\:[\]\\]/g, '\\$&')
    };
    $ush.removeSpaces = function(text) {
        return ('' + text).replace(/\p{Zs}/gu, '')
    };
    $ush.fromCharCode = function(text) {
        return $ush.toString(text).replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    };
    $ush.comparePlainObject = function() {
        const args = arguments;
        for (var i = 1; i > -1; i--) {
            if (!$.isPlainObject(args[i])) {
                return !1
            }
        }
        return JSON.stringify(args[0]) === JSON.stringify(args[1])
    };
    $ush.$rect = function(node) {
        return this.isNode(node) ? node.getBoundingClientRect() : {}
    };
    $ush.setCaretPosition = function(node, position) {
        const self = this;
        if (!self.isNode(node)) {
            return
        }
        if (self.isUndefined(position)) {
            position = node.value.length
        }
        if (node.createTextRange) {
            const range = node.createTextRange();
            range.move('character', position);
            range.select()
        } else {
            if (node.selectionStart) {
                node.focus();
                node.setSelectionRange(position, position)
            } else {
                node.focus()
            }
        }
    };
    $ush.copyTextToClipboard = function(text) {
        const self = this;
        try {
            const textarea = _document.createElement('textarea');
            textarea.value = self.toString(text);
            textarea.setAttribute('readonly', '');
            textarea.setAttribute('css', 'position:absolute;top:-9999px;left:-9999px');
            _document.body.append(textarea);
            textarea.select();
            _document.execCommand('copy');
            if (_window.getSelection) {
                _window.getSelection().removeAllRanges()
            } else if (_document.selection) {
                _document.selection.empty()
            }
            textarea.remove();
            return !0
        } catch (err) {
            return !1
        }
    };
    $ush.storage = function(namespace) {
        if (namespace = $ush.toString(namespace)) {
            namespace += '_'
        }
        const _localStorage = _window.localStorage;
        return {
            set: function(key, value) {
                _localStorage.setItem(namespace + key, value)
            },
            get: function(key) {
                return _localStorage.getItem(namespace + key)
            },
            remove: function(key) {
                _localStorage.removeItem(namespace + key)
            }
        }
    };
    $ush.setCookie = function(name, value, expiry) {
        const date = new Date()
        date.setTime(date.getTime() + (expiry * 86400000));
        _document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
    };
    $ush.getCookie = function(name) {
        name += '='
        const decodedCookie = decodeURIComponent(_document.cookie);
        const cookies = decodedCookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1)
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length)
            }
        }
        return null
    };
    $ush.removeCookie = function(name) {
        const self = this;
        if (self.getCookie(name) !== null) {
            self.setCookie(name, 1, -1)
        }
    };
    $ush.mixinEvents = {
        on: function(eventType, handler, one) {
            const self = this;
            if (self.$$events === _undefined) {
                self.$$events = {}
            }
            if (self.$$events[eventType] === _undefined) {
                self.$$events[eventType] = []
            }
            self.$$events[eventType].push({
                handler: handler,
                one: !!one,
            });
            return self
        },
        one: function(eventType, handler) {
            return this.on(eventType, handler, !0)
        },
        off: function(eventType, handler) {
            const self = this;
            if (self.$$events === _undefined || self.$$events[eventType] === _undefined) {
                return self
            }
            if (handler !== _undefined) {
                for (const handlerPos in self.$$events[eventType]) {
                    if (handler === self.$$events[eventType][handlerPos].handler) {
                        self.$$events[eventType].splice(handlerPos, 1)
                    }
                }
            } else {
                self.$$events[eventType] = []
            }
            return self
        },
        trigger: function(eventType, extraParams) {
            const self = this;
            if (self.$$events === _undefined || self.$$events[eventType] === _undefined || self.$$events[eventType].length === 0) {
                return self
            }
            const args = arguments;
            const params = (args.length > 2 || !Array.isArray(extraParams)) ? [].slice.call(args, 1) : extraParams;
            for (var i = 0; i < self.$$events[eventType].length; i++) {
                const event = self.$$events[eventType][i];
                event.handler.apply(event.handler, params);
                if (!!event.one) {
                    self.off(eventType, event.handler)
                }
            }
            return self
        }
    };
    $ush.urlManager = function(url) {
        const $window = $(_window);
        const events = $ush.clone($ush.mixinEvents);
        var _url = new URL($ush.isUndefined(url) ? _location.href : url),
            lastUrl = _url.toString();
        if ($ush.isUndefined(url)) {
            function refresh() {
                _url = new URL(lastUrl = _location.href)
            }
            $window.on('pushstate', refresh).on('popstate', (e) => {
                refresh();
                events.trigger('popstate', e.originalEvent)
            })
        }
        return $.extend(events, {
            isChanged: function() {
                return this.toString() !== _location.href
            },
            has: function(key, value) {
                if (typeof key === 'string') {
                    const hasKey = _url.searchParams.has(key);
                    if (!value) {
                        return hasKey
                    }
                    return hasKey && _url.searchParams.get(key) === value
                }
                return !1
            },
            set: function(key, value) {
                const setParam = (key, value) => {
                    if ($ush.isUndefined(value) || value === null) {
                        _url.searchParams.delete(key)
                    } else {
                        _url.searchParams.set(key, $ush.toString(value))
                    }
                };
                if ($.isPlainObject(key)) {
                    for (const k in key) {
                        setParam(k, key[k])
                    }
                } else {
                    setParam(key, value)
                }
                return this
            },
            get: function() {
                const args = $ush.toArray(arguments);
                const result = {};
                for (const key of args) {
                    if (this.has(key)) {
                        result[key] = _url.searchParams.get(key)
                    } else {
                        result[key] = _undefined
                    }
                }
                if (args.length === 1) {
                    return Object.values(result)[0]
                }
                return result
            },
            remove: function() {
                const self = this;
                const args = $ush.toArray(arguments);
                for (const key of args)
                    if (self.has(key)) {
                        _url.searchParams.delete(key)
                    }
                return self
            },
            toString: function(urldecode) {
                return _url.toString()
            },
            toJson: function(toString) {
                var result = {};
                _url.searchParams.forEach((_, key, searchParams) => {
                    var values = searchParams.getAll(key);
                    if (values.length < 2) {
                        values = values[0]
                    }
                    result[key] = $ush.isUndefined(values) ? '' : values
                });
                if (toString) {
                    result = JSON.stringify(result);
                    if (result === '{}') {
                        result = ''
                    }
                }
                return result
            },
            ignoreParams: [],
            getChangedParams: function() {
                const self = this;
                const data = {
                    setParams: {},
                    oldParams: {}
                };
                if (!self.isChanged()) {
                    return data
                }
                const ignoreParams = $ush.toArray(self.ignoreParams);
                (new URL(lastUrl)).searchParams.forEach((value, key) => {
                    if (!ignoreParams.includes(key) && !self.has(key, value)) {
                        data.oldParams[key] = value
                    }
                });
                _url.searchParams.forEach((value, key) => {
                    if (!ignoreParams.includes(key) || (!$ush.isUndefined(data.oldParams[key]) && data.oldParams[key] !== value)) {
                        data.setParams[key] = value
                    }
                });
                return $ush.clone(data)
            },
            push: function(state, urldecode) {
                const self = this;
                if (!self.isChanged()) {
                    return
                }
                if (!$.isPlainObject(state)) {
                    state = {}
                }
                history.pushState($.extend(state, self.getChangedParams()), '', lastUrl = self.toString());
                $window.trigger('pushstate');
                return self
            }
        })
    }
}(jQuery);
var _document = document,
    _navigator = navigator,
    _undefined = undefined,
    _window = window;
! function(a, b) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", b) : "object" == typeof module && module.exports ? module.exports = b() : a.EvEmitter = b()
}("undefined" == typeof window ? this : window, function() {
    function a() {}
    var b = a.prototype;
    return b.on = function(a, b) {
        if (a && b) {
            var c = this._events = this._events || {},
                d = c[a] = c[a] || [];
            return -1 == d.indexOf(b) && d.push(b), this
        }
    }, b.once = function(a, b) {
        if (a && b) {
            this.on(a, b);
            var c = this._onceEvents = this._onceEvents || {},
                d = c[a] = c[a] || {};
            return d[b] = !0, this
        }
    }, b.off = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            var d = c.indexOf(b);
            return -1 != d && c.splice(d, 1), this
        }
    }, b.emitEvent = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            c = c.slice(0), b = b || [];
            for (var d = this._onceEvents && this._onceEvents[a], e = 0; e < c.length; e++) {
                var f = c[e],
                    g = d && d[f];
                g && (this.off(a, f), delete d[f]), f.apply(this, b)
            }
            return this
        }
    }, b.allOff = function() {
        delete this._events, delete this._onceEvents
    }, a
}),
function(a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(c) {
        return b(a, c)
    }) : "object" == typeof module && module.exports ? module.exports = b(a, require("ev-emitter")) : a.imagesLoaded = b(a, a.EvEmitter)
}("undefined" == typeof window ? this : window, function(b, c) {
    function f(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }

    function g(b) {
        if (Array.isArray(b)) return b;
        var c = "object" == typeof b && "number" == typeof b.length;
        return c ? a.call(b) : [b]
    }

    function j(a, b, c) {
        if (!(this instanceof j)) return new j(a, b, c);
        var d = a;
        return "string" == typeof a && (d = document.querySelectorAll(a)), d ? (this.elements = g(d), this.options = f({}, this.options), "function" == typeof b ? c = b : f(this.options, b), c && this.on("always", c), this.getImages(), l && (this.jqDeferred = new l.Deferred), void setTimeout(this.check.bind(this))) : void m.error("Bad element for imagesLoaded " + (d || a))
    }

    function i(a) {
        this.img = a
    }

    function k(a, b) {
        this.url = a, this.element = b, this.img = new Image
    }
    var l = b.jQuery,
        m = b.console,
        a = Array.prototype.slice;
    j.prototype = Object.create(c.prototype), j.prototype.options = {}, j.prototype.getImages = function() {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, j.prototype.addElementImages = function(a) {
        "IMG" == a.nodeName && this.addImage(a), !0 === this.options.background && this.addElementBackgroundImages(a);
        var b = a.nodeType;
        if (b && d[b]) {
            for (var c, e = a.querySelectorAll("img"), f = 0; f < e.length; f++) c = e[f], this.addImage(c);
            if ("string" == typeof this.options.background) {
                var g = a.querySelectorAll(this.options.background);
                for (f = 0; f < g.length; f++) {
                    var h = g[f];
                    this.addElementBackgroundImages(h)
                }
            }
        }
    };
    var d = {
        1: !0,
        9: !0,
        11: !0
    };
    return j.prototype.addElementBackgroundImages = function(a) {
        var b = getComputedStyle(a);
        if (b)
            for (var c, d = /url\((['"])?(.*?)\1\)/gi, e = d.exec(b.backgroundImage); null !== e;) c = e && e[2], c && this.addBackground(c, a), e = d.exec(b.backgroundImage)
    }, j.prototype.addImage = function(a) {
        var b = new i(a);
        this.images.push(b)
    }, j.prototype.addBackground = function(a, b) {
        var c = new k(a, b);
        this.images.push(c)
    }, j.prototype.check = function() {
        function a(a, c, d) {
            setTimeout(function() {
                b.progress(a, c, d)
            })
        }
        var b = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(b) {
            b.once("progress", a), b.check()
        }) : void this.complete()
    }, j.prototype.progress = function(a, b, c) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emitEvent("progress", [this, a, b]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && m && m.log("progress: " + c, a, b)
    }, j.prototype.complete = function() {
        var a = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var b = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[b](this)
        }
    }, i.prototype = Object.create(c.prototype), i.prototype.check = function() {
        var a = this.getIsImageComplete();
        return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, i.prototype.getIsImageComplete = function() {
        return this.img.complete && this.img.naturalWidth
    }, i.prototype.confirm = function(a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.img, b])
    }, i.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    }, i.prototype.onload = function() {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, i.prototype.onerror = function() {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, i.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype = Object.create(i.prototype), k.prototype.check = function() {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var a = this.getIsImageComplete();
        a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, k.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype.confirm = function(a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.element, b])
    }, j.makeJQueryPlugin = function(a) {
        a = a || b.jQuery, a && (l = a, l.fn.imagesLoaded = function(a, b) {
            var c = new j(this, a, b);
            return c.jqDeferred.promise(l(this))
        })
    }, j.makeJQueryPlugin(), j
});
jQuery.easing.jswing = jQuery.easing.swing;
var pow = Math.pow;
jQuery.extend(jQuery.easing, {
    def: "easeOutExpo",
    easeInExpo: function(a) {
        return 0 === a ? 0 : pow(2, 10 * a - 10)
    },
    easeOutExpo: function(a) {
        return 1 === a ? 1 : 1 - pow(2, -10 * a)
    },
    easeInOutExpo: function(a) {
        return 0 === a ? 0 : 1 === a ? 1 : .5 > a ? pow(2, 20 * a - 10) / 2 : (2 - pow(2, -20 * a + 10)) / 2
    }
});
_window.$ush = _window.$ush || {};
_window.$us = _window.$us || {};
$us.iOS = (/^iPad|iPhone|iPod/.test(_navigator.platform) || (_navigator.userAgent.indexOf('Mac') > -1 && _navigator.maxTouchPoints > 1 && $ush.isTouchend));
$us.mobileNavOpened = 0;
$us.header = {};
['getCurrentHeight', 'getHeaderInitialPos', 'getHeight', 'getScrollDirection', 'getScrollTop', 'isFixed', 'isHidden', 'isHorizontal', 'isStatic', 'isSticky', 'isStickyAutoHidden', 'isStickyAutoHideEnabled', 'isStickyEnabled', 'isTransparent', 'isVertical', 'on'].map(function(name) {
    $us.header[name] = jQuery.noop
});
jQuery.fn.usMod = function(mod, value) {
    var self = this;
    if (self.length == 0) return self;
    if (value === _undefined) {
        var pcre = new RegExp('^.*?' + mod + '\_([a-zA-Z0-9\_\-]+).*?$');
        return (pcre.exec(self.get(0).className) || [])[1] || !1
    }
    self.each(function(_, item) {
        item.className = item.className.replace(new RegExp('(^| )' + mod + '\_[a-zA-Z0-9\_\-]+( |$)'), '$2');
        if (value !== !1) {
            item.className += ' ' + mod + '_' + value
        }
    });
    return self
};
$us.getAnimationName = function(animationName, defaultAnimationName) {
    if (jQuery.easing.hasOwnProperty(animationName)) {
        return animationName
    }
    return defaultAnimationName ? defaultAnimationName : jQuery.easing._default
};
$us.mixins = {};
$us.mixins.Events = {
    on: function(eventType, handler) {
        var self = this;
        if (self.$$events === _undefined) {
            self.$$events = {}
        }
        if (self.$$events[eventType] === _undefined) {
            self.$$events[eventType] = []
        }
        self.$$events[eventType].push(handler);
        return self
    },
    off: function(eventType, handler) {
        var self = this;
        if (self.$$events === _undefined || self.$$events[eventType] === _undefined) {
            return self
        }
        if (handler !== _undefined) {
            var handlerPos = jQuery.inArray(handler, self.$$events[eventType]);
            if (handlerPos != -1) {
                self.$$events[eventType].splice(handlerPos, 1)
            }
        } else {
            self.$$events[eventType] = []
        }
        return self
    },
    trigger: function(eventType, extraParameters) {
        var self = this;
        if (self.$$events === _undefined || self.$$events[eventType] === _undefined || self.$$events[eventType].length == 0) {
            return self
        }
        var args = arguments,
            params = (args.length > 2 || !Array.isArray(extraParameters)) ? Array.prototype.slice.call(args, 1) : extraParameters;
        params.unshift(self);
        for (var index = 0; index < self.$$events[eventType].length; index++) {
            self.$$events[eventType][index].apply(self.$$events[eventType][index], params)
        }
        return self
    }
};
jQuery.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_navigator.userAgent) || (_navigator.platform == 'MacIntel' && _navigator.maxTouchPoints > 1));
! function($) {
    $us.$window = $(_window);
    $us.$document = $(_document);
    $us.$html = $('html');
    $us.$body = $('.l-body:first');
    $us.$htmlBody = $us.$html.add($us.$body);
    $us.$canvas = $('.l-canvas:first');
    $us.usbPreview = function() {
        return _document.body.className.includes('usb_preview')
    };
    if ($us.iOS) {
        $us.$html.removeClass('no-touch').addClass('ios-touch')
    } else if ($.isMobile || $ush.isTouchend) {
        $us.$html.removeClass('no-touch').addClass('touch')
    } else {}
}(jQuery);
! function($) {
    $us.getCurrentState = function() {
        return '' + $us.$body.usMod('state')
    };
    $us.currentStateIs = function(state) {
        if (!state) {
            return !1
        }
        if (!Array.isArray(state)) {
            state = ['' + state]
        }
        return $.inArray($us.getCurrentState(), state) !== -1
    };
    $us.getAdminBarHeight = function() {
        return (_document.getElementById('wpadminbar') || {}).offsetHeight || 0
    }
}(jQuery);
! function($, undefined) {
    "use strict";

    function USCanvas(options) {
        var self = this;
        var defaults = {
            disableEffectsWidth: 900,
            backToTopDisplay: 100
        };
        self.options = $.extend({}, defaults, options || {});
        self.$header = $('.l-header', $us.$canvas);
        self.$main = $('.l-main', $us.$canvas);
        self.$sections = $('> *:not(.l-header) .l-section', $us.$canvas);
        self.$firstSection = self.$sections.first();
        self.$secondSection = self.$sections.eq(1);
        self.$stickySections = self.$sections.filter('.type_sticky:visible');
        self.$fullscreenSections = self.$sections.filter('.full_height');
        self.$topLink = $('.w-toplink');
        self.type = $us.$canvas.usMod('type');
        self._headerPos = self.$header.usMod('pos');
        self.headerPos = self._headerPos;
        self.headerBg = self.$header.usMod('bg');
        self.rtl = $us.$body.hasClass('rtl');
        self.isScrolling = !1;
        self.isAndroid = /Android/i.test(_navigator.userAgent);
        if ($us.$body.hasClass('us_iframe')) {
            $('a:not([target])').each(function() {
                $(this).attr('target', '_parent')
            });
            $(function($) {
                var $framePreloader = $('.l-popup-box-content .g-preloader', _window.parent.document);
                $framePreloader.hide()
            })
        }
        if (self.hasStickyFirstSection()) {
            $us.$body.addClass('sticky_first_section')
        }
        $us.$window.on('scroll.noPreventDefault', self._events.scroll.bind(self)).on('resize load', self._events.resize.bind(self)).on('scroll.noPreventDefault resize load', self._events.toggleClassIsSticky.bind(self));
        $ush.timeout(self._events.resize.bind(self), 25);
        $ush.timeout(self._events.resize.bind(self), 75)
    }
    USCanvas.prototype = {
        getOffsetTop: function() {
            var top = Math.ceil($us.$canvas.offset().top);
            if ($us.currentStateIs('mobiles')) {
                top -= $us.getAdminBarHeight()
            }
            return top
        },
        isStickySection: function() {
            var self = this;
            return !!self.$stickySections.length
        },
        hasStickySection: function() {
            var self = this;
            if (self.isStickySection()) {
                return self.$stickySections.hasClass('is_sticky')
            }
            return !1
        },
        hasPositionStickySections: function() {
            var self = this;
            if (self.isStickySection()) {
                return self.$stickySections.filter(function() {
                    return $(this).css('position') == 'sticky'
                }).length
            }
            return !1
        },
        getStickySectionHeight: function() {
            var self = this,
                stickySectionHeight = 0;
            if (self.isStickySection()) {
                var header = $us.header,
                    $stickySection = self.$stickySections.first();
                stickySectionHeight = $stickySection.outerHeight(!0);
                if (self.hasStickyFirstSection() && header.isHorizontal() && !header.isStatic()) {
                    stickySectionHeight -= header.getCurrentHeight()
                }
            }
            return stickySectionHeight
        },
        hasStickyFirstSection: function() {
            var self = this,
                $first = self.$stickySections.first();
            return self.isStickySection() && $first.index() === 0 && $first.hasClass('is_sticky')
        },
        isAfterStickySection: function(node) {
            var $node = $(node);
            if (!$node.length) {
                return !1
            }
            if (!$node.hasClass('l-section')) {
                $node = $node.closest('.l-section')
            }
            return $node.index() > this.$stickySections.index()
        },
        getHeightFirstSection: function() {
            return this.$firstSection.length ? parseFloat(this.$firstSection.outerHeight(!0)) : 0
        },
        _events: {
            scroll: function() {
                var self = this,
                    scrollTop = parseInt($us.$window.scrollTop());
                self.$topLink.toggleClass('active', (scrollTop >= self.winHeight * self.options.backToTopDisplay / 100));
                if (self.isAndroid) {
                    if (self.pid) {
                        $ush.clearTimeout(self.pid)
                    }
                    self.isScrolling = !0;
                    self.pid = $ush.timeout(function() {
                        self.isScrolling = !1
                    }, 100)
                }
            },
            resize: function() {
                var self = this;
                self.winHeight = parseInt($us.$window.height());
                self.winWidth = parseInt($us.$window.width());
                $us.$body.toggleClass('disable_effects', (self.winWidth < self.options.disableEffectsWidth));
                if ($us.$body.hasClass('us_iframe')) {
                    var $frameContent = $('.l-popup-box-content', _window.parent.document),
                        outerHeight = $us.$body.outerHeight(!0);
                    if (outerHeight > 0 && $(_window.parent).height() > outerHeight) {
                        $frameContent.css('height', outerHeight)
                    } else {
                        $frameContent.css('height', '')
                    }
                }
                self._events.scroll.call(self)
            },
            toggleClassIsSticky: function() {
                var self = this;
                if (!self.isStickySection()) {
                    return
                }
                self.$stickySections.each(function(_, section) {
                    var $section = $(section),
                        offsetTop = section.getBoundingClientRect().top - parseInt($section.css('top'));
                    $section.toggleClass('is_sticky', (parseInt(offsetTop) === 0 && $section.css('position') == 'sticky'))
                })
            }
        }
    };
    $us.canvas = new USCanvas($us.canvasOptions || {})
}(jQuery);
! function($) {
    $.fn.resetInlineCSS = function() {
        var self = this,
            args = [].slice.call(arguments);
        if (args.length && Array.isArray(args[0])) {
            args = args[0]
        }
        for (var index = 0; index < args.length; index++) {
            self.css(args[index], '')
        }
        return self
    };
    $.fn.clearPreviousTransitions = function() {
        var self = this,
            prevTimers = (self.data('animation-timers') || '').split(',');
        if (prevTimers.length >= 2) {
            self.resetInlineCSS('transition');
            prevTimers.map(clearTimeout);
            self.removeData('animation-timers')
        }
        return self
    };
    $.fn.performCSSTransition = function(css, duration, onFinish, easing, delay) {
        duration = duration || 250;
        delay = delay || 25;
        easing = easing || 'ease';
        var self = this,
            transition = [];
        self.clearPreviousTransitions();
        for (var attr in css) {
            if (!css.hasOwnProperty(attr)) {
                continue
            }
            transition.push(attr + ' ' + (duration / 1000) + 's ' + easing)
        }
        transition = transition.join(', ');
        self.css({
            transition: transition
        });
        var timer1 = setTimeout(function() {
            self.css(css)
        }, delay);
        var timer2 = setTimeout(function() {
            self.resetInlineCSS('transition');
            if (typeof onFinish === 'function') {
                onFinish()
            }
        }, duration + delay);
        self.data('animation-timers', timer1 + ',' + timer2)
    };
    $.fn.slideDownCSS = function(duration, onFinish, easing, delay) {
        var self = this;
        if (self.length == 0) {
            return
        }
        self.clearPreviousTransitions();
        self.resetInlineCSS('padding-top', 'padding-bottom');
        var timer1 = setTimeout(function() {
            var paddingTop = parseInt(self.css('padding-top')),
                paddingBottom = parseInt(self.css('padding-bottom'));
            self.css({
                visibility: 'hidden',
                position: 'absolute',
                height: 'auto',
                'padding-top': 0,
                'padding-bottom': 0,
                display: 'block'
            });
            var height = self.height();
            self.css({
                overflow: 'hidden',
                height: '0px',
                opacity: 0,
                visibility: '',
                position: ''
            });
            self.performCSSTransition({
                opacity: 1,
                height: height + paddingTop + paddingBottom,
                'padding-top': paddingTop,
                'padding-bottom': paddingBottom
            }, duration, function() {
                self.resetInlineCSS('overflow').css('height', 'auto');
                if (typeof onFinish == 'function') {
                    onFinish()
                }
            }, easing, delay)
        }, 25);
        self.data('animation-timers', timer1 + ',null')
    };
    $.fn.slideUpCSS = function(duration, onFinish, easing, delay) {
        var self = this;
        if (self.length == 0) {
            return
        }
        self.clearPreviousTransitions();
        self.css({
            height: self.outerHeight(),
            overflow: 'hidden',
            'padding-top': self.css('padding-top'),
            'padding-bottom': self.css('padding-bottom')
        });
        self.performCSSTransition({
            height: 0,
            opacity: 0,
            'padding-top': 0,
            'padding-bottom': 0
        }, duration, function() {
            self.resetInlineCSS('overflow', 'padding-top', 'padding-bottom').css({
                display: 'none'
            });
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, easing, delay)
    };
    $.fn.fadeInCSS = function(duration, onFinish, easing, delay) {
        var self = this;
        if (self.length == 0) {
            return
        }
        self.clearPreviousTransitions();
        self.css({
            opacity: 0,
            display: 'block'
        });
        self.performCSSTransition({
            opacity: 1
        }, duration, onFinish, easing, delay)
    };
    $.fn.fadeOutCSS = function(duration, onFinish, easing, delay) {
        var self = this;
        if (self.length == 0) {
            return
        }
        self.performCSSTransition({
            opacity: 0
        }, duration, function() {
            self.css('display', 'none');
            if (typeof onFinish === 'function') {
                onFinish()
            }
        }, easing, delay)
    }
}(jQuery);
jQuery(function($) {
    "use strict";
    if (_document.cookie.indexOf('us_cookie_notice_accepted=true') !== -1) {
        $('.l-cookie').remove()
    } else {
        $us.$document.on('click', '#us-set-cookie', (e) => {
            e.preventDefault();
            e.stopPropagation();
            var d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            _document.cookie = 'us_cookie_notice_accepted=true; expires=' + d.toUTCString() + '; path=/;';
            if (location.protocol === 'https:') {
                _document.cookie += ' secure;'
            }
            $('.l-cookie').remove()
        })
    }
    $('.w-color-switch input[name=us-color-scheme-switch]').prop('checked', $ush.getCookie('us_color_scheme_switch_is_on') === 'true');
    $us.$document.on('change', '[name=us-color-scheme-switch]', (e) => {
        if ($ush.getCookie('us_color_scheme_switch_is_on') === 'true') {
            $us.$html.removeClass('us-color-scheme-on');
            $ush.removeCookie('us_color_scheme_switch_is_on')
        } else {
            $us.$html.addClass('us-color-scheme-on');
            $ush.setCookie('us_color_scheme_switch_is_on', 'true', 30)
        }
    });
    var USPopupLink = function(context, options) {
        var $links = $('a[ref=magnificPopup][class!=direct-link]:not(.inited)', context || _document),
            defaultOptions = {
                fixedContentPos: !0,
                mainClass: 'mfp-fade',
                removalDelay: 300,
                type: 'image'
            };
        if ($links.length) {
            $links.addClass('inited').magnificPopup($.extend({}, defaultOptions, options || {}))
        }
    };
    $.fn.wPopupLink = function(options) {
        return this.each(function() {
            $(this).data('wPopupLink', new USPopupLink(this, options))
        })
    };
    $us.$document.wPopupLink();
    (function() {
        var $footer = $('.l-footer');
        if ($us.$body.hasClass('footer_reveal') && $footer.length && $footer.html().trim().length) {
            var usFooterReveal = function() {
                var footerHeight = $footer.innerHeight();
                if (_window.innerWidth > parseInt($us.canvasOptions.columnsStackingWidth) - 1) {
                    $us.$canvas.css('margin-bottom', Math.round(footerHeight) - 1)
                } else {
                    $us.$canvas.css('margin-bottom', '')
                }
            };
            usFooterReveal();
            $us.$window.on('resize load', usFooterReveal)
        }
    })();
    var $usYTVimeoVideoContainer = $('.with_youtube, .with_vimeo');
    if ($usYTVimeoVideoContainer.length) {
        $us.$window.on('resize load', function() {
            $usYTVimeoVideoContainer.each(function() {
                var $container = $(this),
                    $frame = $container.find('iframe').first(),
                    cHeight = $container.innerHeight(),
                    cWidth = $container.innerWidth(),
                    fWidth = '',
                    fHeight = '';
                if (cWidth / cHeight < 16 / 9) {
                    fWidth = cHeight * (16 / 9);
                    fHeight = cHeight
                } else {
                    fWidth = cWidth;
                    fHeight = fWidth * (9 / 16)
                }
                $frame.css({
                    'width': Math.round(fWidth),
                    'height': Math.round(fHeight),
                })
            })
        })
    }
});
(function($, undefined) {
    "use strict";

    function USWaypoints() {
        var self = this;
        self.waypoints = [];
        $us.$canvas.on('contentChange', self._countAll.bind(self));
        $us.$window.on('resize load', self._events.resize.bind(self)).on('scroll scroll.waypoints', self._events.scroll.bind(self));
        $ush.timeout(self._events.resize.bind(self), 75);
        $ush.timeout(self._events.scroll.bind(self), 75)
    }
    USWaypoints.prototype = {
        _events: {
            scroll: function() {
                var self = this,
                    scrollTop = parseInt($us.$window.scrollTop());
                scrollTop = (scrollTop >= 0) ? scrollTop : 0;
                for (var i = 0; i < self.waypoints.length; i++) {
                    if (self.waypoints[i].scrollPos < scrollTop) {
                        self.waypoints[i].fn(self.waypoints[i].$node);
                        self.waypoints.splice(i, 1);
                        i--
                    }
                }
            },
            resize: function() {
                var self = this;
                $ush.timeout(function() {
                    self._countAll.call(self);
                    self._events.scroll.call(self)
                }, 150);
                self._countAll.call(self);
                self._events.scroll.call(self)
            }
        },
        add: function($node, offset, fn) {
            var self = this;
            $node = ($node instanceof $) ? $node : $($node);
            if ($node.length == 0) {
                return
            }
            if (typeof offset != 'string' || offset.indexOf('%') == -1) {
                offset = parseInt(offset)
            }
            if ($node.offset().top < ($us.$window.height() + $us.$window.scrollTop())) {
                offset = 0
            }
            var waypoint = {
                $node: $node,
                offset: offset,
                fn: fn
            };
            self._count(waypoint);
            self.waypoints.push(waypoint)
        },
        _count: function(waypoint) {
            var elmTop = waypoint.$node.offset().top,
                winHeight = $us.$window.height();
            if (typeof waypoint.offset == 'number') {
                waypoint.scrollPos = elmTop - winHeight + waypoint.offset
            } else {
                waypoint.scrollPos = elmTop - winHeight + winHeight * parseInt(waypoint.offset) / 100
            }
        },
        _countAll: function() {
            var self = this;
            for (var i = 0; i < self.waypoints.length; i++) {
                self._count(self.waypoints[i])
            }
        }
    };
    $us.waypoints = new USWaypoints
})(jQuery);
(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !_window.requestAnimationFrame; ++x) {
        _window.requestAnimationFrame = _window[vendors[x] + 'RequestAnimationFrame'];
        _window.cancelAnimationFrame = _window[vendors[x] + 'CancelAnimationFrame'] || _window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!_window.requestAnimationFrame) {
        _window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = _window.setTimeout(function() {
                    callback(currTime + timeToCall)
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id
        }
    }
    if (!_window.cancelAnimationFrame) {
        _window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        }
    }
}());
if ($us.$body.hasClass('single-format-video')) {
    figure = $us.$body.find('figure.wp-block-embed div.wp-block-embed__wrapper');
    if (figure.length) {
        figure.each(function() {
            if (this.firstElementChild === null) {
                this.remove()
            }
        })
    }
}! function($, undefined) {
    "use strict";

    function usCollapsibleContent(container) {
        const self = this;
        self._events = {
            showContent: self.showContent.bind(self),
        };
        self.$container = $(container);
        self.$firstElement = $('> *:first', self.$container);
        self.collapsedHeight = self.$container.data('content-height') || 200;
        self.$container.on('click', '.collapsible-content-more, .collapsible-content-less', self._events.showContent);
        if (!self.$container.closest('.owl-carousel').length) {
            self.setHeight.call(self)
        }
    };
    usCollapsibleContent.prototype = {
        setHeight: function() {
            const self = this;
            let collapsedHeight = self.$firstElement.css('height', self.collapsedHeight).height();
            self.$firstElement.css('height', '');
            let heightFirstElement = self.$firstElement.height();
            if (heightFirstElement && heightFirstElement <= collapsedHeight) {
                $('.toggle-links', self.$container).hide();
                self.$firstElement.css('height', '');
                self.$container.removeClass('with_collapsible_content')
            } else {
                $('.toggle-links', self.$container).show();
                self.$firstElement.css('height', self.collapsedHeight)
            }
        },
        showContent: function(e) {
            const self = this;
            e.preventDefault();
            e.stopPropagation();
            self.$container.toggleClass('show_content', $(e.target).hasClass('collapsible-content-more')).trigger('showContent');
            $ush.timeout(() => {
                $us.$canvas.trigger('contentChange');
                if ($.isMobile && !$ush.isNodeInViewport(self.$container[0])) {
                    $us.$htmlBody.stop(!0, !1).scrollTop(self.$container.offset().top - $us.header.getCurrentHeight(!0))
                }
            }, 1)
        }
    };
    $.fn.usCollapsibleContent = function() {
        return this.each(function() {
            $(this).data('usCollapsibleContent', new usCollapsibleContent(this))
        })
    };
    $('[data-content-height]', $us.$canvas).usCollapsibleContent();
    $us.$document.on('usPostList.itemsLoaded usGrid.itemsLoaded', (_, $items) => {
        $('[data-content-height]', $items).usCollapsibleContent()
    });
    if ($('.owl-carousel', $us.$canvas).length) {
        $us.$canvas.on('click', '.collapsible-content-more, .collapsible-content-less', function(e) {
            var $target = $(e.target),
                $container = $target.closest('[data-content-height]');
            if (!$container.data('usCollapsibleContent')) {
                $container.usCollapsibleContent();
                $target.trigger('click')
            }
        })
    }
}(jQuery);
! function($, undefined) {
    $us.$window.on('us.wpopup.afterShow', function(_, WPopup) {
        if (WPopup instanceof $us.WPopup && $('video.wp-video-shortcode', WPopup.$box).length) {
            var handle = $ush.timeout(function() {
                $ush.clearTimeout(handle);
                _window.dispatchEvent(new Event('resize'))
            }, 1)
        }
    })
}(jQuery);
! function($) {
    "use strict";
    var _window = window,
        _document = document,
        _location = location,
        _undefined = undefined;
    _window.$ush = _window.$ush || {};
    _window.$us = _window.$us || {};

    function USScroll(options) {
        var self = this;
        var defaults = {
            attachOnInit: '\
				.menu-item a[href*="#"],\
				.menu-item[href*="#"],\
				.post_custom_field a[href*="#"],\
				.post_title a[href*="#"],\
				.w-ibanner a[href*="#"],\
				.vc_custom_heading a[href*="#"],\
				.vc_icon_element a[href*="#"],\
				.w-comments-title a[href*="#"],\
				.w-iconbox a[href*="#"],\
				.w-image a[href*="#"]:not([onclick]),\
				.w-text a[href*="#"],\
				.w-toplink,\
				a.smooth-scroll[href*="#"],\
				a.w-btn[href*="#"]:not([onclick]),\
				a.w-grid-item-anchor[href*="#"]',
            buttonActiveClass: 'active',
            menuItemActiveClass: 'current-menu-item',
            menuItemAncestorActiveClass: 'current-menu-ancestor',
            animationDuration: ($us.canvasOptions || {}).scrollDuration || 0,
            animationEasing: $us.getAnimationName('easeInOutExpo'),
            endAnimationEasing: $us.getAnimationName('easeOutExpo')
        };
        self.options = $.extend({}, defaults, options || {});
        self.blocks = {};
        self.isScrolling = !1;
        self._events = {
            cancel: self.cancel.bind(self),
            scroll: self.scroll.bind(self),
            resize: self.resize.bind(self)
        };
        $us.$window.on('resize load', $ush.debounce(self._events.resize, 1));
        $ush.timeout(self._events.resize, 75);
        $us.$window.on('scroll.noPreventDefault', self._events.scroll);
        $ush.timeout(self._events.scroll, 75);
        if (self.options.attachOnInit) {
            self.attach(self.options.attachOnInit)
        }
        $us.$canvas.on('contentChange', self._countAllPositions.bind(self));
        if (_document.location.hash && _document.location.hash.indexOf('#!') == -1) {
            var hash = _document.location.hash,
                scrollPlace = (self.blocks[hash] !== _undefined) ? hash : _undefined;
            if (scrollPlace === _undefined) {
                try {
                    var $target = $(hash);
                    if ($target.length != 0) {
                        scrollPlace = $target
                    }
                } catch (error) {}
            }
            if (scrollPlace !== _undefined) {
                var keepScrollPositionTimer = setInterval(function() {
                    self.scrollTo(scrollPlace);
                    if (_document.readyState !== 'loading') {
                        clearInterval(keepScrollPositionTimer)
                    }
                }, 100);
                var clearHashEvents = () => {
                    $us.$window.off('load mousewheel.noPreventDefault DOMMouseScroll touchstart.noPreventDefault', clearHashEvents);
                    $ush.timeout(() => {
                        $us.canvas._events.resize.call($us.canvas);
                        self._countAllPositions();
                        if ($us.hasOwnProperty('waypoints')) {
                            $us.waypoints._countAll()
                        }
                        self.scrollTo(scrollPlace)
                    }, 100)
                };
                $us.$window.on('load mousewheel.noPreventDefault DOMMouseScroll touchstart.noPreventDefault', clearHashEvents)
            }
        }
        self.animationOptions = {
            duration: self.options.animationDuration,
            easing: self.options.animationEasing,
            start: function() {
                self.isScrolling = !0
            },
            complete: function() {
                self.cancel.call(self)
            },
        }
    }
    USScroll.prototype = {
        _countPosition: function(hash) {
            var self = this,
                $target = self.blocks[hash].target,
                targetTop = $target.offset().top;
            if ($target.hasClass('type_sticky')) {
                var key = 'realTop';
                if (!$target.hasClass('is_sticky')) {
                    $target.removeData(key)
                }
                if (!$target.data(key)) {
                    $target.data(key, targetTop)
                }
                targetTop = $target.data(key) || targetTop
            }
            if ($us.$body.hasClass('footer_reveal') && $target.closest('footer').length) {
                targetTop = $us.$body.outerHeight(!0) + (targetTop - $us.$window.scrollTop())
            }
            self.blocks[hash].top = Math.ceil(targetTop - $us.canvas.getOffsetTop())
        },
        _countAllPositions: function() {
            var self = this;
            for (var hash in self.blocks) {
                if (self.blocks[hash]) {
                    self._countPosition(hash)
                }
            }
        },
        _indicatePosition: function(activeHash) {
            var self = this;
            for (var hash in self.blocks) {
                if (!self.blocks[hash]) {
                    continue
                }
                var block = self.blocks[hash];
                if (block.buttons !== _undefined) {
                    block.buttons.toggleClass(self.options.buttonActiveClass, hash === activeHash)
                }
                if (block.menuItems !== _undefined) {
                    block.menuItems.toggleClass(self.options.menuItemActiveClass, hash === activeHash)
                }
                if (block.menuAncestors !== _undefined) {
                    block.menuAncestors.removeClass(self.options.menuItemAncestorActiveClass)
                }
            }
            if (self.blocks[activeHash] !== _undefined && self.blocks[activeHash].menuAncestors !== _undefined) {
                self.blocks[activeHash].menuAncestors.addClass(self.options.menuItemAncestorActiveClass)
            }
        },
        attach: function(anchors) {
            var self = this,
                $anchors = $(anchors);
            if ($anchors.length == 0) {
                return
            }
            var _pathname = decodeURIComponent(_location.pathname),
                patternPathname = new RegExp('^' + _pathname.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '#'),
                patternPageId = /^\/?(\?page_id=\d+).*?/;
            $anchors.each(function(index, anchor) {
                var $anchor = $(anchor),
                    href = ('' + $anchor.attr('href')).replace(_location.origin, ''),
                    hash = $anchor.prop('hash'),
                    hasProtocol = /^(https?:\/\/)/.test(href),
                    hasPageId = patternPageId.test(href);
                if (hash.indexOf('#!') > -1 || href.indexOf('#') < 0 || (href.substr(0, 2) == '/#' && _location.search && _pathname == '/') || (hasProtocol && href.indexOf(_location.origin) !== 0) || (hasPageId && href.indexOf((_location.search.match(patternPageId) || [])[1]) == -1) || (href.charAt(0) == '/' && !hasPageId && !patternPathname.test(href))) {
                    return
                }
                if (hash != '' && hash != '#') {
                    if (self.blocks[hash] === _undefined) {
                        var $target = $(hash),
                            $type = '';
                        if ($target.length == 0) {
                            return
                        }
                        if ($target.hasClass('g-cols') && $target.parent().children().length == 1) {
                            $target = $target.closest('.l-section')
                        }
                        if ($target.hasClass('w-tabs-section')) {
                            var $newTarget = $target.closest('.w-tabs');
                            if (!$newTarget.hasClass('accordion')) {
                                $target = $newTarget
                            }
                            $type = 'tab'
                        } else if ($target.hasClass('w-tabs')) {
                            $type = 'tabs'
                        }
                        self.blocks[hash] = {
                            target: $target,
                            type: $type
                        };
                        self._countPosition(hash)
                    }
                    if ($anchor.parent().length > 0 && $anchor.parent().hasClass('menu-item')) {
                        var $menuIndicator = $anchor.closest('.menu-item');
                        self.blocks[hash].menuItems = (self.blocks[hash].menuItems || $()).add($menuIndicator);
                        var $menuAncestors = $menuIndicator.parents('.menu-item-has-children');
                        if ($menuAncestors.length > 0) {
                            self.blocks[hash].menuAncestors = (self.blocks[hash].menuAncestors || $()).add($menuAncestors)
                        }
                    } else {
                        self.blocks[hash].buttons = (self.blocks[hash].buttons || $()).add($anchor)
                    }
                }
                $anchor.on('click', function(event) {
                    event.preventDefault();
                    if ($anchor.hasClass('w-nav-anchor') && $anchor.closest('.menu-item').hasClass('menu-item-has-children') && $anchor.closest('.w-nav').hasClass('type_mobile')) {
                        var menuOptions = $anchor.closest('.w-nav').find('.w-nav-options:first')[0].onclick() || {},
                            dropByLabel = $anchor.parents('.menu-item').hasClass('mobile-drop-by_label'),
                            dropByArrow = $anchor.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                        if (dropByLabel || (menuOptions.mobileBehavior && !dropByArrow)) {
                            return !1
                        }
                    }
                    if ($anchor.attr('href') === '#' && $anchor.closest('.w-popup-wrap').length) {
                        return !1
                    }
                    self.scrollTo(hash, !0);
                    if (typeof self.blocks[hash] !== 'undefined') {
                        var block = self.blocks[hash];
                        if ($.inArray(block.type, ['tab', 'tabs']) !== -1) {
                            var $linkedSection = block.target.find('.w-tabs-section[id="' + hash.substr(1) + '"]');
                            if (block.type === 'tabs') {
                                $linkedSection = block.target.find('.w-tabs-section:first')
                            } else if (block.target.hasClass('w-tabs-section')) {
                                $linkedSection = block.target
                            }
                            if ($linkedSection.length) {
                                $linkedSection.find('.w-tabs-section-header').trigger('click')
                            }
                        } else if (block.menuItems !== _undefined && $us.currentStateIs(['mobiles', 'tablets']) && $us.$body.hasClass('header-show')) {
                            $us.$body.removeClass('header-show')
                        }
                    }
                })
            })
        },
        getPlacePosition: function(place) {
            var self = this,
                data = {
                    newY: 0,
                    type: ''
                };
            if (place === '' || place === '#') {
                data.newY = 0;
                data.placeType = 'top'
            } else if (self.blocks[place] !== _undefined) {
                self._countPosition(place);
                data.newY = self.blocks[place].top;
                data.placeType = 'hash';
                place = self.blocks[place].target
            } else if (place instanceof $) {
                if (place.hasClass('w-tabs-section')) {
                    var newPlace = place.closest('.w-tabs');
                    if (!newPlace.hasClass('accordion')) {
                        place = newPlace
                    }
                }
                data.newY = place.offset().top;
                data.placeType = 'element'
            } else {
                data.newY = place
            }
            if ($us.canvas.isStickySection() && $us.canvas.hasPositionStickySections() && !$(place).hasClass('type_sticky') && $us.canvas.isAfterStickySection(place)) {
                data.newY -= $us.canvas.getStickySectionHeight()
            }
            return data
        },
        scrollTo: function(place, animate) {
            var self = this,
                $place = $(place);
            if ($place.closest('.w-popup-wrap').length) {
                self.scrollToPopupContent(place);
                return !0
            }
            var offset = self.getPlacePosition.call(self, place),
                indicateActive = function() {
                    if (offset.type === 'hash') {
                        self._indicatePosition(place)
                    } else {
                        self.scroll()
                    }
                };
            if (animate) {
                if (navigator.userAgent.match(/iPad/i) != null && $('.us_iframe').length && offset.type == 'hash') {
                    $place[0].scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    })
                }
                var scrollTop = $us.$window.scrollTop(),
                    scrollDirections = scrollTop < offset.newY ? 'down' : 'up';
                if (scrollTop === offset.newY) {
                    return
                }
                var animateOptions = $.extend({}, self.animationOptions, {
                    always: function() {
                        self.isScrolling = !1;
                        indicateActive()
                    }
                });
                animateOptions.step = function(now, fx) {
                    var newY = self.getPlacePosition(place).newY;
                    if ($us.header.isHorizontal() && $us.header.isStickyEnabled()) {
                        newY -= $us.header.getCurrentHeight()
                    }
                    fx.end = newY
                };
                if ($place.hasClass('us_animate_this')) {
                    $place.trigger('us_startAnimate')
                }
                $us.$htmlBody.stop(!0, !1).animate({
                    scrollTop: offset.newY + 'px'
                }, animateOptions);
                $us.$window.on('keydown mousewheel.noPreventDefault DOMMouseScroll touchstart.noPreventDefault', self._events.cancel)
            } else {
                if ($us.header.isStickyEnabled() && $us.header.isHorizontal()) {
                    offset.newY -= $us.header.getCurrentHeight(!0)
                }
                $us.$htmlBody.stop(!0, !1).scrollTop(offset.newY);
                indicateActive()
            }
        },
        scrollToPopupContent: function(place) {
            var self = this,
                id = place.replace('#', ''),
                elm = _document.getElementById(id);
            var animateOptions = $.extend({}, self.animationOptions, {
                always: function() {
                    self.isScrolling = !1
                },
            });
            $(elm).closest('.w-popup-wrap').stop(!0, !1).animate({
                scrollTop: elm.offsetTop + 'px'
            }, animateOptions);
            $us.$window.on('keydown mousewheel.noPreventDefault DOMMouseScroll touchstart.noPreventDefault', self._events.cancel)
        },
        cancel: function() {
            $us.$htmlBody.stop(!0, !1);
            $us.$window.off('keydown mousewheel.noPreventDefault DOMMouseScroll touchstart', this._events.cancel);
            this.isScrolling = !1
        },
        scroll: function() {
            var self = this,
                scrollTop = Math.ceil($us.header.getScrollTop());
            scrollTop = (scrollTop >= 0) ? scrollTop : 0;
            if (!self.isScrolling) {
                var activeHash;
                for (var hash in self.blocks) {
                    if (!self.blocks[hash]) {
                        continue
                    }
                    var top = self.blocks[hash].top,
                        $target = self.blocks[hash].target;
                    if (!$us.header.isHorizontal()) {
                        top -= $us.canvas.getOffsetTop()
                    } else {
                        if ($us.header.isStickyEnabled()) {
                            top -= $us.header.getCurrentHeight(!0)
                        }
                        if ($us.canvas.hasStickySection()) {
                            top -= $us.canvas.getStickySectionHeight()
                        }
                    }
                    top = $ush.parseInt(top.toFixed(0));
                    if (scrollTop >= top && scrollTop <= (top + $target.outerHeight(!1))) {
                        activeHash = hash
                    }
                }
                $ush.debounce_fn_1ms(self._indicatePosition.bind(self, activeHash))
            }
        },
        resize: function() {
            var self = this;
            $ush.timeout(function() {
                self._countAllPositions();
                self.scroll()
            }, 150);
            self._countAllPositions();
            self.scroll()
        }
    };
    $(function() {
        $us.scroll = new USScroll($us.scrollOptions || {})
    })
}(jQuery);
(function($) {
    "use strict";
    var USAnimate = function(container) {
        var self = this;
        self.$container = $(container);
        self.$items = $('[class*="us_animate_"]:not(.off_autostart)', self.$container);
        self.$items.each(function(_, item) {
            var $item = $(item);
            if ($item.data('_animate_inited') || $item.hasClass('off_autostart')) {
                return
            }
            if ($item.parents('.owl-carousel').length) {
                $item.addClass('start')
            }
            $item.data('_animate_inited', !0);
            $us.waypoints.add($item, '12%', function($node) {
                if (!$node.hasClass('start')) {
                    $ush.timeout(function() {
                        $node.addClass('start')
                    }, 20)
                }
            });
            $item.one('us_startAnimate', function() {
                if (!$item.hasClass('start')) {
                    $item.addClass('start')
                }
            })
        })
    };
    window.USAnimate = USAnimate;
    new USAnimate(document);
    $('.wpb_animate_when_almost_visible').each(function() {
        $us.waypoints.add($(this), '12%', function($node) {
            if (!$node.hasClass('wpb_start_animation')) {
                $ush.timeout(function() {
                    $node.addClass('wpb_start_animation')
                }, 20)
            }
        })
    })
})(jQuery);
! function($) {
    "use strict";
    $us.CommnentsForm = function(container, options) {
        this.init(container, options)
    };
    $us.CommnentsForm.prototype = {
        init: function(container, options) {
            this.$container = $(container);
            this.$form = this.$container.find('form.comment-form');
            if (!this.$form.length) {
                return
            }
            this.$jsonContainer = this.$container.find('.us-comments-json');
            if (!this.$jsonContainer.length) {
                return
            }
            this.jsonData = this.$jsonContainer[0].onclick() || {};
            this.$jsonContainer.remove();
            this.$fields = {
                content: {
                    field: this.$form.find('textarea'),
                    msg: this.jsonData.no_content_msg || 'Please enter a Message'
                },
                name: {
                    field: this.$form.find('.for_text input[type="text"]'),
                    msg: this.jsonData.no_name_msg || 'Please enter your Name'
                },
                email: {
                    field: this.$form.find('.for_email input[type="email"]'),
                    msg: this.jsonData.no_email_msg || 'Please enter a valid email address.'
                }
            };
            this._events = {
                formSubmit: this.formSubmit.bind(this)
            };
            this.$form.on('submit', this._events.formSubmit)
        },
        formSubmit: function(event) {
            this.$form.find('.w-form-row.check_wrong').removeClass('check_wrong');
            this.$form.find('.w-form-state').html('');
            for (var i in this.$fields) {
                if (this.$fields[i].field.length == 0) {
                    continue
                }
                if (this.$fields[i].field.val() == '' && this.$fields[i].field.attr('data-required')) {
                    this.$fields[i].field.closest('.w-form-row').toggleClass('check_wrong');
                    this.$fields[i].field.closest('.w-form-row').find('.w-form-row-state').html(this.$fields[i].msg);
                    event.preventDefault()
                }
            }
        }
    };
    $.fn.CommnentsForm = function(options) {
        return this.each(function() {
            $(this).data('CommnentsForm', new $us.CommnentsForm(this, options))
        })
    };
    $(function() {
        $('.w-post-elm.post_comments.layout_comments_template').CommnentsForm();
        $('.l-section.for_comments').CommnentsForm()
    })
}(jQuery);
! function($, undefined) {
    var
        _parseFloat = parseFloat,
        _parseInt = parseInt,
        _undefined = undefined,
        _window = window
    var USCounterNumber = function(container) {
        var self = this;
        self.$container = $(container);
        self.initialString = self.$container.html() + '';
        self.finalString = self.$container.data('final') + '';
        self.format = self.getFormat(self.initialString, self.finalString);
        if (self.format.decMark) {
            var pattern = new RegExp('[^0-9\/' + self.format.decMark + ']+', 'g');
            self.initial = _parseFloat(self.initialString.replace(pattern, '').replace(self.format.decMark, '.'));
            self.final = _parseFloat(self.finalString.replace(pattern, '').replace(self.format.decMark, '.'))
        } else {
            self.initial = _parseInt(self.initialString.replace(/[^0-9]+/g, ''));
            self.final = _parseInt(self.finalString.replace(/[^0-9]+/g, ''))
        }
        if (self.format.accounting) {
            if (self.initialString.length > 0 && self.initialString[0] == '(') {
                self.initial = -self.initial
            }
            if (self.finalString.length > 0 && self.finalString[0] == '(') {
                self.final = -self.final
            }
        }
    };
    USCounterNumber.prototype = {
        step: function(now) {
            var self = this,
                value = (1 - now) * self.initial + self.final * now,
                intPart = Math[self.format.decMark ? 'floor' : 'round'](value).toString(),
                result = '';
            if (self.format.zerofill) {
                var amountOfZeros = (self.format.intDigits - intPart.length);
                if (amountOfZeros > 0) {
                    intPart = '0'.repeat(amountOfZeros) + intPart
                }
            }
            if (self.format.groupMark) {
                if (self.format.indian) {
                    result += intPart.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + self.format.groupMark)
                } else {
                    result += intPart.replace(/\B(?=(\d{3})+(?!\d))/g, self.format.groupMark)
                }
            } else {
                result += intPart
            }
            if (self.format.decMark) {
                var decimalPart = (value % 1).toFixed(self.format.decDigits).substring(2);
                result += self.format.decMark + decimalPart
            }
            if (self.format.accounting && result.length > 0 && result[0] == '-') {
                result = '(' + result.substring(1) + ')'
            }
            self.$container.html(result)
        },
        getFormat: function(initial, final) {
            var self = this,
                iFormat = self._getFormat(initial),
                fFormat = self._getFormat(final),
                format = $.extend({}, iFormat, fFormat);
            if (format.groupMark == format.decMark) {
                delete format.groupMark
            }
            return format
        },
        _getFormat: function(str) {
            var marks = str.replace(/[0-9\(\)\-]+/g, ''),
                format = {};
            if (str.charAt(0) == '(') {
                format.accounting = !0
            }
            if (/^0[0-9]/.test(str)) {
                format.zerofill = !0
            }
            str = str.replace(/[\(\)\-]/g, '');
            if (marks.length != 0) {
                if (marks.length > 1) {
                    format.groupMark = marks.charAt(0);
                    if (marks.charAt(0) != marks.charAt(marks.length - 1)) {
                        format.decMark = marks.charAt(marks.length - 1)
                    }
                    if (str.split(format.groupMark).length > 2 && str.split(format.groupMark)[1].length == 2) {
                        format.indian = !0
                    }
                } else {
                    format[(((str.length - 1) - str.indexOf(marks)) == 3 && marks !== '.') ? 'groupMark' : 'decMark'] = marks
                }
                if (format.decMark) {
                    format.decDigits = str.length - str.indexOf(format.decMark) - 1
                }
            }
            if (format.zerofill) {
                format.intDigits = str.replace(/[^\d]+/g, '').length - (format.decDigits || 0)
            }
            return format
        }
    };
    var USCounterText = function(container) {
        var self = this;
        self.$container = $(container);
        self.initial = self.$container.text() + '';
        self.final = self.$container.data('final') + '';
        self.partsStates = self.getStates(self.initial, self.final);
        self.len = 1 / (self.partsStates.length - 1);
        self.curState = 0
    };
    USCounterText.prototype = {
        step: function(now) {
            var self = this,
                state = Math.round(Math.max(0, now / self.len));
            if (state == self.curState) {
                return
            }
            self.$container.html(self.partsStates[state]);
            self.curState = state
        },
        getStates: function(initial, final) {
            var min = Math.min,
                dist = [],
                i, j;
            for (i = 0; i <= initial.length; i++) {
                dist[i] = [i]
            }
            for (j = 1; j <= final.length; j++) {
                dist[0][j] = j;
                for (i = 1; i <= initial.length; i++) {
                    dist[i][j] = (initial[i - 1] === final[j - 1]) ? dist[i - 1][j - 1] : (Math.min(dist[i - 1][j], dist[i][j - 1], dist[i - 1][j - 1]) + 1)
                }
            }
            var states = [final];
            for (i = initial.length, j = final.length; i > 0 || j > 0; i--, j--) {
                var min = dist[i][j];
                if (i > 0) {
                    min = Math.min(min, dist[i - 1][j], (j > 0) ? dist[i - 1][j - 1] : min)
                }
                if (j > 0) {
                    min = Math.min(min, dist[i][j - 1])
                }
                if (min >= dist[i][j]) {
                    continue
                }
                if (min == dist[i][j - 1]) {
                    states.unshift(states[0].substring(0, j - 1) + states[0].substring(j));
                    i++
                } else if (min == dist[i - 1][j - 1]) {
                    states.unshift(states[0].substring(0, j - 1) + initial[i - 1] + states[0].substring(j))
                } else if (min == dist[i - 1][j]) {
                    states.unshift(states[0].substring(0, j) + initial[i - 1] + states[0].substring(j));
                    j++
                }
            }
            return states
        }
    };
    var USCounter = function(container) {
        var self = this;
        self.$container = $(container);
        self.parts = [];
        self.duration = _parseFloat(self.$container.data('duration') || 2) * 1000;
        self.$container.find('.w-counter-value-part').each(function(index, part) {
            var $part = $(part);
            if ($part.html() + '' == $part.data('final') + '') {
                return
            }
            var type = $part.usMod('type');
            if (type == 'number') {
                self.parts.push(new USCounterNumber($part))
            } else {
                self.parts.push(new USCounterText($part))
            }
        });
        if (_window.$us !== _undefined && _window.$us.scroll !== _undefined) {
            $us.waypoints.add(self.$container, '15%', self.animate.bind(self))
        } else {
            self.animate()
        }
    };
    USCounter.prototype = {
        animate: function(duration) {
            var self = this;
            self.$container.css('w-counter', 0).animate({
                'w-counter': 1
            }, {
                duration: self.duration,
                step: self.step.bind(self)
            })
        },
        step: function(now) {
            var self = this;
            for (var i = 0; i < self.parts.length; i++) {
                self.parts[i].step(now)
            }
        }
    };
    $.fn.wCounter = function(options) {
        return this.each(function() {
            var self = this;
            $(self).data('wCounter', new USCounter(self, options))
        })
    };
    $(function() {
        $('.w-counter').wCounter()
    })
}(jQuery);
! function($, undefined) {
    var _window = window,
        _document = document,
        _undefined = undefined;
    _window.$us = _window.$us || {};
    $us.WForm = function(container) {
        var self = this;
        self.$form = $(container);
        if (!self.$form.hasClass('for_cform')) {
            self.$form = $('.w-form.for_cform', container)
        }
        self.$formH = $('.w-form-h', self.$form);
        self.$dateFields = $('.w-form-row.for_date input', self.$form);
        self.$message = $('.w-form-message', self.$form);
        self.$reusableBlock = $('.w-form-reusable-block', self.$form);
        self.$submit = $('.w-btn', self.$form);
        self.options = {};
        self.isFileValid = !0;
        self.pickerOptions = {};
        var $formJson = $('.w-form-json', self.$form);
        if ($formJson.is('[onclick]')) {
            self.options = $formJson[0].onclick() || {};
            if (!$us.usbPreview()) {
                $formJson.remove()
            }
        }
        if (self.$dateFields.length) {
            $(() => {
                self._initDateField()
            })
        }
        $(['input[type=text]', 'input[type=email]', 'input[type=tel]', 'input[type=number]', 'input[type=date]', 'input[type=search]', 'input[type=url]', 'input[type=password]', 'textarea'].join(), self.$form).each((_, input) => {
            const $input = $(input);
            const $row = $input.closest('.w-form-row');
            if ($input.attr('type') === 'hidden') {
                return
            }
            $row.toggleClass('not-empty', $input.val() != '');
            $input.on('input change', () => {
                $row.toggleClass('not-empty', $input.val() != '')
            })
        });
        self._events = {
            changeFile: self._changeFile.bind(self),
            submit: self._submit.bind(self)
        };
        self.$form.on('change', 'input[type=file]:visible', self._events.changeFile).on('submit', self._events.submit)
    };
    $.extend($us.WForm.prototype, {
        getExtension: function(name) {
            return ('' + name).split('.').pop()
        },
        _validExtension: function(file, accepts) {
            if (!accepts) {
                return !0
            }
            var self = this;
            accepts = ('' + accepts).split(',');
            for (var i in accepts) {
                var accept = ('' + accepts[i]).trim();
                if (!accept) {
                    continue
                }
                if (accept.indexOf('/') > -1) {
                    var acceptMatches = accept.split('/');
                    if (file.type === accept || (acceptMatches[1] === '*' && ('' + file.type).indexOf(acceptMatches[0]) === 0)) {
                        return !0
                    }
                } else if (self.getExtension(file.name) === accept.replace(/[^A-z\d]+/, '')) {
                    return !0
                }
            }
            return !1
        },
        _requiredValidation: function() {
            const self = this;
            let errors = 0;
            $('[data-required=true]', self.$form).each(function(_, input) {
                let $input = $(input),
                    isEmpty = $input.is('[type=checkbox]') ? !$input.is(':checked') : $input.val() == '',
                    $row = $input.closest('.w-form-row');
                if ($row.hasClass('for_checkboxes') || $row.hasClass('for_radio')) {
                    return !0
                }
                if (input.type === 'file') {
                    isEmpty = isEmpty || !self.isFileValid
                }
                if (input.type === 'select-one') {
                    isEmpty = $input.val() === $('option:first-child', $input).val()
                }
                $row.toggleClass('check_wrong', isEmpty);
                if (isEmpty) {
                    errors++
                }
            });
            $('.for_checkboxes.required', self.$form).each(function(_, elm) {
                let $input = $('input[type=checkbox]', elm),
                    $row = $input.closest('.w-form-row'),
                    isEmpty = !$input.is(':checked');
                $row.toggleClass('check_wrong', isEmpty);
                if (isEmpty) {
                    errors++
                }
            });
            $('.for_radio.required', self.$form).each(function(_, elm) {
                let $input = $('input[type=radio]', elm).first(),
                    $row = $input.closest('.w-form-row'),
                    isEmpty = $input.is(':checked');
                $row.toggleClass('check_wrong', isEmpty);
                if (isEmpty) {
                    errors++
                }
            });
            return !errors
        },
        _initDateField: function() {
            var self = this;
            $.each(self.$dateFields, function(_, input) {
                var $input = $(input);
                self.pickerOptions.dateFormat = $input.data('date-format');
                try {
                    $input.datepicker(self.pickerOptions);
                    if ($input.closest('.w-popup-wrap').length) {
                        $input.on('click', function(e) {
                            let $datepicker = $('#ui-datepicker-div'),
                                datepickerHeight = $datepicker.outerHeight(),
                                inputBounds = e.currentTarget.getBoundingClientRect();
                            if (_window.innerHeight - (inputBounds.bottom + datepickerHeight) > 0) {
                                $datepicker.css({
                                    position: 'fixed',
                                    left: inputBounds.left,
                                    top: (inputBounds.top + inputBounds.height)
                                })
                            } else {
                                $datepicker.css({
                                    position: 'fixed',
                                    left: inputBounds.left,
                                    top: (inputBounds.top - datepickerHeight),
                                })
                            }
                        })
                    }
                } catch (e) {}
            })
        },
        _changeFile: function(e) {
            var self = this,
                errMessage = '',
                input = e.target,
                $input = $(input),
                accept = $input.attr('accept') || '',
                maxSize = $input.data('max_size') || $input.data('std') || 0;
            if (input.files.length) {
                for (var i in input.files) {
                    if (errMessage) {
                        break
                    }
                    var file = input.files[i];
                    if (!(file instanceof File)) {
                        continue
                    }
                    if (!self._validExtension(file, accept)) {
                        errMessage = (self.options.messages.err_extension || '').replace('%s', self.getExtension(file.name))
                    }
                    if (!errMessage && file.size > (parseFloat(maxSize) * 1048576)) {
                        errMessage = (self.options.messages.err_size || '').replace('%s', maxSize)
                    }
                }
            }
            $input.closest('.for_file').toggleClass('check_wrong', !(self.isFileValid = !errMessage)).find('.w-form-row-state').html(errMessage || self.options.messages.err_empty)
        },
        _submit: function(e) {
            e.preventDefault();
            var self = this;
            self.$message.usMod('type', !1).html('');
            if (self.$submit.hasClass('loading') || !self._requiredValidation() || !self.isFileValid) {
                return
            }
            self.$submit.addClass('loading');
            var formData = _window.FormData ? new FormData(self.$form[0]) : self.$form.serialize();
            if (self.$form.hasClass('validate_by_recaptcha')) {
                grecaptcha.ready(function() {
                    try {
                        grecaptcha.execute(self.options.recaptcha_site_key, {
                            action: 'submit'
                        }).then(function(token) {
                            formData.append('g-recaptcha-response', token);
                            sendAjaxRequest()
                        })
                    } catch (e) {
                        self.$message.usMod('type', 'error').html(self.options.messages.err_recaptcha_keys);
                        self.$submit.removeClass('loading')
                    }
                })
            } else {
                sendAjaxRequest()
            }

            function sendAjaxRequest() {
                $.ajax({
                    type: 'POST',
                    url: self.options.ajaxurl,
                    data: formData,
                    cache: !1,
                    processData: !1,
                    contentType: !1,
                    dataType: 'json',
                    success: function(res) {
                        $('.w-form-row.check_wrong', self.$form).removeClass('check_wrong');
                        if (res.success) {
                            if (res.data.redirect_url) {
                                _window.location.href = res.data.redirect_url;
                                return
                            }
                            if (res.data.popup_selector) {
                                const $popupTrigger = $(res.data.popup_selector).find('.w-popup-trigger');
                                if ($popupTrigger.length) {
                                    $popupTrigger.trigger('click')
                                }
                            }
                            if (res.data.message) {
                                self.$message.usMod('type', 'success').html(res.data.message)
                            }
                            if (self.$reusableBlock.length) {
                                self.$reusableBlock.slideDown(400)
                            }
                            if (self.options.close_popup_after_sending) {
                                const $popupCloser = self.$form.closest('.w-popup-wrap').find('.w-popup-closer');
                                if ($popupCloser.length) {
                                    $popupCloser.trigger('click')
                                }
                            }
                            if (self.options.hide_form_after_sending) {
                                const formPos = self.$form.offset().top;
                                const scrollTop = $us.$window.scrollTop();
                                if (!$ush.isNodeInViewport(self.$form[0]) || formPos >= (scrollTop + window.innerHeight) || scrollTop >= formPos) {
                                    $us.$htmlBody.animate({
                                        scrollTop: formPos - $us.header.getInitHeight()
                                    }, 400)
                                }
                                self.$formH.slideUp(400)
                            }
                            $('.w-form-row.not-empty', self.$form).removeClass('not-empty');
                            $('input[type=text], input[type=email], textarea', self.$form).val('');
                            self.$form.trigger('usCformSuccess', res).get(0).reset()
                        } else {
                            if ($.isPlainObject(res.data)) {
                                for (var fieldName in res.data) {
                                    if (fieldName === 'empty_message') {
                                        $resultField.usMod('type', 'error');
                                        continue
                                    }
                                    if (fieldName === 'reCAPTCHA' && res.data[fieldName].error_message) {
                                        self.$message.usMod('type', 'error').html(res.data.reCAPTCHA.error_message)
                                    }
                                    $('[name="' + fieldName + '"]', self.$form).closest('.w-form-row').addClass('check_wrong').find('.w-form-row-state').html(res.data[fieldName].error_message || '')
                                }
                            } else {
                                self.$message.usMod('type', 'error').html(res.data)
                            }
                        }
                    },
                    complete: function() {
                        self.$submit.removeClass('loading')
                    }
                })
            }
        }
    });
    $.fn.wForm = function() {
        return this.each(function() {
            $(this).data('wForm', new $us.WForm(this))
        })
    };
    $('.w-form.for_cform').wForm()
}(jQuery);
(function($, _undefined) {
    "use strict";
    var _document = document,
        _window = window;
    $us.WGrid = function(container, options) {
        this.init(container, options)
    };
    $us.WGrid.prototype = {
        init: function(container, options) {
            const self = this;
            this.$container = $(container);
            this.$filters = $('.g-filters-item', this.$container);
            this.$list = $('.w-grid-list', this.$container);
            this.$loadmore = $('.g-loadmore', this.$container);
            this.$pagination = $('> .pagination', this.$container);
            this.$preloader = $('.w-grid-preloader', this.$container);
            this.$style = $('> style:first', this.$container);
            this.loading = !1;
            this.changeUpdateState = !1;
            this.gridFilter = null;
            this.curFilterTaxonomy = '';
            this.paginationType = this.$pagination.length ? 'regular' : (this.$loadmore.length ? 'ajax' : 'none');
            this.filterTaxonomyName = this.$list.data('filter_taxonomy_name') ? this.$list.data('filter_taxonomy_name') : 'category';
            if (this.$container.data('gridInit') == 1) {
                return
            }
            this.$container.data('gridInit', 1);
            self._events = {
                updateState: self._updateState.bind(self),
                updateOrderBy: self._updateOrderBy.bind(self),
                initMagnificPopup: self._initMagnificPopup.bind(self),
                usbReloadIsotopeLayout: self._usbReloadIsotopeLayout.bind(self),
                scrollToGrid: $ush.debounce(self.scrollToGrid.bind(self), 10),
            };
            var $jsonContainer = $('.w-grid-json', this.$container);
            if ($jsonContainer.length && $jsonContainer.is('[onclick]')) {
                this.ajaxData = $jsonContainer[0].onclick() || {};
                if (!$us.usbPreview()) $jsonContainer.remove()
            } else {
                this.ajaxData = {};
                this.ajaxUrl = ''
            }
            if (this.$list.hasClass('owl-carousel')) {
                let carouselOptions = {
                    navElement: 'button',
                    navText: ['', ''],
                    responsiveRefreshRate: 100,
                }
                $.extend(carouselOptions, this.ajaxData.carousel_settings || {});
                if ($us.$html.hasClass('touch') || $us.$html.hasClass('ios-touch')) {
                    $.extend(carouselOptions, {
                        mouseDrag: !1,
                    })
                }
                if ($us.usbPreview()) {
                    $.extend(carouselOptions, {
                        autoplayHoverPause: !0,
                        mouseDrag: !1,
                        touchDrag: !1,
                        loop: !1,
                    })
                }
                if (carouselOptions.autoplayContinual) {
                    carouselOptions.slideTransition = 'linear';
                    carouselOptions.autoplaySpeed = carouselOptions.autoplayTimeout;
                    carouselOptions.smartSpeed = carouselOptions.autoplayTimeout;
                    if (!carouselOptions.autoWidth) {
                        carouselOptions.slideBy = 1
                    }
                }
                self.$list.on('initialized.owl.carousel', function(e) {
                    var $list = self.$list,
                        $toggleLinks = $('[data-content-height]', e.currentTarget);
                    $toggleLinks.each((_, node) => {
                        var $node = $(node),
                            usCollapsibleContent = $node.data('usCollapsibleContent');
                        if ($ush.isUndefined(usCollapsibleContent)) {
                            usCollapsibleContent = $node.usCollapsibleContent().data('usCollapsibleContent')
                        }
                        usCollapsibleContent.setHeight();
                        $ush.timeout(() => {
                            $list.trigger('refresh.owl.carousel')
                        }, 1)
                    });
                    if ($.isMobile && $list.closest('.w-tabs-section.active').length) {
                        $ush.timeout(() => {
                            $list.trigger('refresh.owl.carousel')
                        }, 50)
                    }
                    if (carouselOptions.autoHeight) {
                        $toggleLinks.on('showContent', () => {
                            $list.trigger('refresh.owl.carousel')
                        })
                    }
                });
                self.$list.on('mousedown.owl.core', (e) => {
                    if ($(e.target).is('[class^="collapsible-content-"]')) {
                        let owlCarousel = self.$list.data('owl.carousel');
                        if (owlCarousel.settings.mouseDrag) {
                            owlCarousel.$stage.trigger('mouseup.owl.core')
                        }
                        if (owlCarousel.settings.touchDrag) {
                            owlCarousel.$stage.trigger('touchcancel.owl.core')
                        }
                    }
                });
                var owlCarousel = self.$list.owlCarousel(carouselOptions).data('owl.carousel');
                if (owlCarousel && carouselOptions.autoplayContinual) {
                    this.$list.trigger('next.owl.carousel')
                }
                if (owlCarousel && carouselOptions.aria_labels.prev && carouselOptions.aria_labels.next) {
                    owlCarousel.$element.find('.owl-prev').attr('aria-label', carouselOptions.aria_labels.prev);
                    owlCarousel.$element.find('.owl-next').attr('aria-label', carouselOptions.aria_labels.next)
                }
                let currentOwlResponsiveValue = self.$list.attr('class').match(/owl-responsive-(\d+)/)[1];
                let carouselOptionsResponsive = carouselOptions.responsive || {};
                if (carouselOptionsResponsive[currentOwlResponsiveValue] && carouselOptionsResponsive[currentOwlResponsiveValue].items === 1) {
                    self.$list.toggleClass('autoheight', carouselOptionsResponsive[currentOwlResponsiveValue].autoHeight)
                }
            }
            if (this.$container.hasClass('open_items_in_popup') && !this.$container.hasClass('us_post_list') && !this.$container.hasClass('us_product_list') && !$ush.isUndefined(this.ajaxData)) {
                this.lightboxOpened = !1;
                this.lightboxTimer = null;
                this.originalURL = _window.location.href;
                this.$popup = $('.l-popup', this.$container);
                this.$popupBox = $('.l-popup-box', this.$popup);
                this.$popupContentPreloader = $('.l-popup-box-content .g-preloader', this.$popup);
                this.$popupContentFrame = $('.l-popup-box-content-frame', this.$popup);
                this.$popupNextArrow = $('.l-popup-arrow.to_next', this.$popup);
                this.$popupPrevArrow = $('.l-popup-arrow.to_prev', this.$popup);
                $us.$body.append(this.$popup);
                this.initLightboxAnchors();
                this.$popup.on('click', '.l-popup-closer', this.hideLightbox.bind(this)).on('click', '.l-popup-box', this.hideLightbox.bind(this)).on('click', '.l-popup-box-content', function(e) {
                    e.stopPropagation()
                });
                $us.$window.on('resize', function() {
                    if (this.lightboxOpened && $us.$window.width() < $us.canvasOptions.disableEffectsWidth) {
                        this.hideLightbox()
                    }
                }.bind(this))
            }
            if (this.$list.hasClass('owl-carousel')) {
                return
            }
            if (this.paginationType != 'none' || this.$filters.length) {
                if (this.ajaxData == _undefined) {
                    return
                }
                this.templateVars = this.ajaxData.template_vars || {};
                if (this.filterTaxonomyName) {
                    this.initialFilterTaxonomy = this.$list.data('filter_default_taxonomies') ? this.$list.data('filter_default_taxonomies').toString().split(',') : '';
                    this.curFilterTaxonomy = this.initialFilterTaxonomy
                }
                this.curPage = this.ajaxData.current_page || 1;
                this.infiniteScroll = this.ajaxData.infinite_scroll || 0
            }
            if (this.$container.hasClass('with_isotope')) {
                this.$list.imagesLoaded(function() {
                    var smallestItemSelector, isotopeOptions = {
                        itemSelector: '.w-grid-item',
                        layoutMode: (this.$container.hasClass('isotope_fit_rows')) ? 'fitRows' : 'masonry',
                        isOriginLeft: !$('.l-body').hasClass('rtl'),
                        transitionDuration: 0
                    };
                    if (this.$list.find('.size_1x1').length) {
                        smallestItemSelector = '.size_1x1'
                    } else if (this.$list.find('.size_1x2').length) {
                        smallestItemSelector = '.size_1x2'
                    } else if (this.$list.find('.size_2x1').length) {
                        smallestItemSelector = '.size_2x1'
                    } else if (this.$list.find('.size_2x2').length) {
                        smallestItemSelector = '.size_2x2'
                    }
                    if (smallestItemSelector) {
                        smallestItemSelector = smallestItemSelector || '.w-grid-item';
                        isotopeOptions.masonry = {
                            columnWidth: smallestItemSelector
                        }
                    }
                    this.$list.on('layoutComplete', function() {
                        if (_window.USAnimate) {
                            $('.w-grid-item.off_autostart', this.$list).removeClass('off_autostart');
                            new USAnimate(this.$list)
                        }
                        $us.$window.trigger('scroll.waypoints')
                    }.bind(this));
                    this.$list.isotope(isotopeOptions);
                    if (this.paginationType == 'ajax') {
                        this.initAjaxPagination()
                    }
                    $us.$canvas.on('contentChange', function() {
                        this.$list.imagesLoaded(function() {
                            this.$list.isotope('layout')
                        }.bind(this))
                    }.bind(this))
                }.bind(this));
                self.$container.on('usbReloadIsotopeLayout', self._events.usbReloadIsotopeLayout)
            } else if (this.paginationType == 'ajax') {
                this.initAjaxPagination()
            }
            this.$filters.each(function(index, filter) {
                var $filter = $(filter),
                    taxonomy = $filter.data('taxonomy');
                $filter.on('click', function() {
                    if (taxonomy != this.curFilterTaxonomy) {
                        if (this.loading) {
                            return
                        }
                        this.setState(1, taxonomy);
                        this.$filters.removeClass('active');
                        $filter.addClass('active')
                    }
                }.bind(this))
            }.bind(this));
            if (this.$container.closest('.l-main').length) {
                $us.$body.on('us_grid.updateState', self._events.updateState).on('us_grid.updateOrderBy', self._events.updateOrderBy)
            }
            self.$container.on('scrollToGrid', self._events.scrollToGrid);
            self.$list.on('click', '[ref=magnificPopup]', self._events.initMagnificPopup)
        },
        _updateState: function(e, queryString, page, gridFilter) {
            var $container = this.$container;
            if (!$container.is('[data-filterable="true"]') || !$container.hasClass('used_by_grid_filter') || (!$container.is(':visible') && !$container.hasClass('hidden'))) {
                return
            }
            page = page || 1;
            this.changeUpdateState = !0;
            this.gridFilter = gridFilter;
            if (this.ajaxData === _undefined) {
                this.ajaxData = {}
            }
            if (!this.hasOwnProperty('templateVars')) {
                this.templateVars = this.ajaxData.template_vars || {
                    query_args: {}
                }
            }
            this.templateVars.us_grid_filter_query_string = queryString;
            if (this.templateVars.query_args !== !1) {
                this.templateVars.query_args.paged = page
            }
            this.templateVars.filters_args = gridFilter.filtersArgs || {};
            this.setState(page);
            if (this.paginationType === 'regular' && /page(=|\/)/.test(location.href)) {
                var url = location.href.replace(/(page(=|\/))(\d+)(\/?)/, '$1' + page + '$2');
                if (history.replaceState) {
                    history.replaceState(_document.title, _document.title, url)
                }
            }
        },
        _updateOrderBy: function(e, orderby, page, gridOrder) {
            if (!this.$container.is('[data-filterable="true"]') || !this.$container.hasClass('used_by_grid_order')) {
                return
            }
            page = page || 1;
            this.changeUpdateState = !0;
            if (!this.hasOwnProperty('templateVars')) {
                this.templateVars = this.ajaxData.template_vars || {
                    query_args: {}
                }
            }
            if (this.templateVars.query_args !== !1) {
                this.templateVars.query_args.paged = page
            }
            this.templateVars.grid_orderby = orderby;
            this.setState(page)
        },
        _initMagnificPopup: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var $target = $(e.currentTarget);
            if ($target.data('magnificPopup') === _undefined) {
                $target.magnificPopup({
                    type: 'image',
                    mainClass: 'mfp-fade'
                });
                $target.trigger('click')
            }
        },
        _usbReloadIsotopeLayout: function() {
            const self = this;
            if (self.$container.hasClass('with_isotope')) {
                self.$list.isotope('layout')
            }
        },
        initLightboxAnchors: function() {
            var self = this;
            $('.w-grid-item-anchor:not(.lightbox_init)', self.$list).on('click', function(e) {
                var $item = $(e.target).closest('.w-grid-item'),
                    url = $('.w-grid-item-anchor', $item).attr('href');
                if (!$item.hasClass('custom-link')) {
                    if ($us.$window.width() >= $us.canvasOptions.disableEffectsWidth) {
                        e.stopPropagation();
                        e.preventDefault();
                        self.openLightboxItem(url, $item);
                        $item.addClass('lightbox_init')
                    }
                }
            })
        },
        initAjaxPagination: function() {
            this.$loadmore.on('click', function() {
                if (this.curPage < this.ajaxData.max_num_pages) {
                    this.setState(this.curPage + 1)
                }
            }.bind(this));
            if (this.infiniteScroll) {
                $us.waypoints.add(this.$loadmore, '-70%', function() {
                    if (!this.loading) {
                        this.$loadmore.click()
                    }
                }.bind(this))
            }
        },
        setState: function(page, taxonomy) {
            const self = this;
            if (self.loading && !self.changeUpdateState) {
                return
            }
            if (page !== 1 && self.paginationType == 'ajax' && self.none !== _undefined && self.none == !0) {
                return
            }
            self.none = !1;
            self.loading = !0;
            self.$container.next('.w-grid-none').addClass('hidden');
            if (self.$filters.length && !self.changeUpdateState) {
                taxonomy = taxonomy || self.curFilterTaxonomy;
                if (taxonomy == '*') {
                    taxonomy = self.initialFilterTaxonomy
                }
                if (taxonomy != '') {
                    var newTaxArgs = {
                            'taxonomy': self.filterTaxonomyName,
                            'field': 'slug',
                            'terms': taxonomy
                        },
                        taxQueryFound = !1;
                    if (self.templateVars.query_args.tax_query == _undefined) {
                        self.templateVars.query_args.tax_query = []
                    } else {
                        $.each(self.templateVars.query_args.tax_query, (index, taxArgs) => {
                            if (taxArgs != null && taxArgs.taxonomy == self.filterTaxonomyName) {
                                self.templateVars.query_args.tax_query[index] = newTaxArgs;
                                taxQueryFound = !0;
                                return !1
                            }
                        })
                    }
                    if (!taxQueryFound) {
                        self.templateVars.query_args.tax_query.push(newTaxArgs)
                    }
                } else if (self.templateVars.query_args.tax_query != _undefined) {
                    $.each(self.templateVars.query_args.tax_query, (index, taxArgs) => {
                        if (taxArgs != null && taxArgs.taxonomy == self.filterTaxonomyName) {
                            self.templateVars.query_args.tax_query[index] = null;
                            return !1
                        }
                    })
                }
            }
            if (self.templateVars.query_args !== !1) {
                self.templateVars.query_args.paged = page
            }
            if (self.paginationType == 'ajax') {
                if (page == 1) {
                    self.$loadmore.addClass('hidden')
                } else {
                    self.$loadmore.addClass('loading')
                }
                if (!self.infiniteScroll) {
                    self.prevScrollTop = $us.$window.scrollTop()
                }
            }
            if (self.paginationType != 'ajax' || page == 1) {
                self.$preloader.addClass('active');
                if (self.$list.data('isotope')) {
                    self.$list.isotope('remove', self.$container.find('.w-grid-item'));
                    self.$list.isotope('layout')
                } else {
                    self.$container.find('.w-grid-item').remove()
                }
            }
            self.ajaxData.template_vars = JSON.stringify(self.templateVars);
            var isotope = self.$list.data('isotope');
            if (isotope && page == 1) {
                self.$list.html('');
                isotope.remove(isotope.items);
                isotope.reloadItems()
            }
            if (self.xhr !== _undefined) {
                self.xhr.abort()
            }
            self.xhr = $.ajax({
                type: 'post',
                url: $us.ajaxUrl,
                data: self.ajaxData,
                cache: !1,
                beforeSend: function() {
                    self.$container.removeClass('hidden')
                },
                success: function(html) {
                    var $result = $(html),
                        $container = $('.w-grid-list', $result).first(),
                        $pagination = $('.pagination > *', $result),
                        $items = $container.children(),
                        smallestItemSelector;
                    self.$container.toggleClass('hidden', !$items.length);
                    $container.imagesLoaded(() => {
                        self.beforeAppendItems($items);
                        $items.appendTo(self.$list);
                        $container.html('');
                        var $sliders = $items.find('.w-slider');
                        if (isotope) {
                            isotope.insert($items);
                            isotope.reloadItems()
                        }
                        if ($sliders.length) {
                            $sliders.each((index, slider) => {
                                $(slider).usImageSlider().find('.royalSlider').data('royalSlider').ev.on('rsAfterInit', () => {
                                    if (isotope) {
                                        self.$list.isotope('layout')
                                    }
                                })
                            })
                        }
                        if (isotope) {
                            if (self.$list.find('.size_1x1').length) {
                                smallestItemSelector = '.size_1x1'
                            } else if (self.$list.find('.size_1x2').length) {
                                smallestItemSelector = '.size_1x2'
                            } else if (self.$list.find('.size_2x1').length) {
                                smallestItemSelector = '.size_2x1'
                            } else if (self.$list.find('.size_2x2').length) {
                                smallestItemSelector = '.size_2x2'
                            }
                            if (isotope.options.masonry) {
                                isotope.options.masonry.columnWidth = smallestItemSelector || '.w-grid-item'
                            }
                            self.$list.isotope('layout');
                            self.$list.trigger('layoutComplete')
                        }
                        if (self.paginationType == 'ajax') {
                            if (page == 1) {
                                var $jsonContainer = $result.find('.w-grid-json');
                                if ($jsonContainer.length) {
                                    var ajaxData = $jsonContainer[0].onclick() || {};
                                    self.ajaxData.max_num_pages = ajaxData.max_num_pages || self.ajaxData.max_num_pages
                                } else {
                                    self.ajaxData.max_num_pages = 1
                                }
                            }
                            if (self.templateVars.query_args.paged >= self.ajaxData.max_num_pages || !$items.length) {
                                self.$loadmore.addClass('hidden')
                            } else {
                                self.$loadmore.removeClass('hidden').removeClass('loading')
                            }
                            if (self.infiniteScroll) {
                                $us.waypoints.add(self.$loadmore, '-70%', () => {
                                    if (!self.loading) {
                                        self.$loadmore.click()
                                    }
                                })
                            } else if (Math.round(self.prevScrollTop) != Math.round($us.$window.scrollTop())) {
                                $us.$window.scrollTop(self.prevScrollTop)
                            }
                        } else if (self.paginationType === 'regular' && self.changeUpdateState) {
                            $('a[href]', $pagination).each((_, item) => {
                                var $item = $(item),
                                    pathname = location.pathname.replace(/((\/page.*)?)\/$/, '');
                                $item.attr('href', pathname + $item.attr('href'))
                            });
                            self.$pagination.html($pagination)
                        }
                        if (self.$container.hasClass('open_items_in_popup')) {
                            self.initLightboxAnchors()
                        }
                        var $result_none = $result.next('.w-grid-none');
                        if (self.changeUpdateState && $result_none.length) {
                            var $none = self.$container.next('.w-grid-none');
                            if ($none.length) {
                                $none.removeClass('hidden')
                            } else {
                                self.$container.after($result_none)
                            }
                            var $nextGrid = $('.w-grid:first', self.$container.next('.w-grid-none'));
                            if ($nextGrid.length) {
                                $nextGrid.wGrid()
                            }
                            self.none = !0
                        }
                        if (self.changeUpdateState && self.gridFilter) {
                            var $jsonData = $result.filter('.w-grid-filter-json-data:first');
                            if ($jsonData.length) {
                                self.gridFilter.trigger('us_grid_filter.update-items-amount', $jsonData[0].onclick() || {})
                            }
                            $jsonData.remove()
                        }
                        var customStyles = $('style#grid-post-content-css', $result).html() || '';
                        if (customStyles) {
                            if (!self.$style.length) {
                                self.$style = $('<style></style>');
                                self.$container.append(self.$style)
                            }
                            self.$style.text(self.$style.text() + customStyles)
                        }
                        $us.$canvas.resize();
                        self.$preloader.removeClass('active');
                        if (_window.USAnimate && self.$container.hasClass('with_css_animation')) {
                            new USAnimate(self.$container)
                        }
                        $ush.timeout(() => {
                            $us.$document.trigger('usGrid.itemsLoaded', [$items])
                        }, 1)
                    });
                    self.$container.trigger('scrollToGrid');
                    self.loading = !1;
                    self.$container.trigger('USGridItemsLoaded')
                },
                error: function() {
                    self.$loadmore.removeClass('loading')
                },
            });
            self.curPage = page;
            self.curFilterTaxonomy = taxonomy
        },
        scrollToGrid: function() {
            const self = this;
            if (self.curPage !== 1) {
                return
            }
            var $container = self.$container;
            if ($container.hasClass('hidden')) {
                $container = $container.next()
            }
            const gridPos = $ush.parseInt($container.offset().top);
            if (!gridPos) {
                return
            }
            const scrollTop = $us.$window.scrollTop();
            if (scrollTop >= gridPos || gridPos >= (scrollTop + _window.innerHeight)) {
                $us.$htmlBody.stop(!0, !1).animate({
                    scrollTop: (gridPos - $us.header.getCurrentHeight())
                }, 500)
            }
        },
        _hasScrollbar: function() {
            return _document.documentElement.scrollHeight > _document.documentElement.clientHeight
        },
        _getScrollbarSize: function() {
            if ($us.scrollbarSize === _undefined) {
                var scrollDiv = _document.createElement('div');
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                _document.body.appendChild(scrollDiv);
                $us.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                _document.body.removeChild(scrollDiv)
            }
            return $us.scrollbarSize
        },
        openLightboxItem: function(itemUrl, $item) {
            this.showLightbox();
            var prevIndex, nextIndex, currentIndex = 0,
                items = $('.w-grid-item:visible:not(.custom-link)', this.$container).toArray();
            for (var i in items) {
                if ($item.is(items[i])) {
                    currentIndex = parseInt(i);
                    break
                }
            }
            if (currentIndex > 0) {
                prevIndex = currentIndex - 1
            }
            if (currentIndex < items.length) {
                nextIndex = currentIndex + 1
            }
            var $prevItem = $(typeof prevIndex === 'number' ? items[prevIndex] : ''),
                $nextItem = $(typeof nextIndex === 'number' ? items[nextIndex] : '');
            if ($nextItem.length > 0) {
                this.$popupNextArrow.removeClass('hidden');
                this.$popupNextArrow.attr('title', $nextItem.find('.w-grid-item-title').text());
                this.$popupNextArrow.off('click').click(function(e) {
                    var $nextItemAnchor = $nextItem.find('.w-grid-item-anchor'),
                        nextItemUrl = $nextItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(nextItemUrl, $nextItem)
                }.bind(this))
            } else {
                this.$popupNextArrow.attr('title', '');
                this.$popupNextArrow.addClass('hidden')
            }
            if ($prevItem.length > 0) {
                this.$popupPrevArrow.removeClass('hidden');
                this.$popupPrevArrow.attr('title', $prevItem.find('.w-grid-item-title').text());
                this.$popupPrevArrow.off('click').on('click', function(e) {
                    var $prevItemAnchor = $prevItem.find('.w-grid-item-anchor'),
                        prevItemUrl = $prevItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(prevItemUrl, $prevItem)
                }.bind(this))
            } else {
                this.$popupPrevArrow.attr('title', '');
                this.$popupPrevArrow.addClass('hidden')
            }
            if (itemUrl.indexOf('?') !== -1) {
                this.$popupContentFrame.attr('src', itemUrl + '&us_iframe=1')
            } else {
                this.$popupContentFrame.attr('src', itemUrl + '?us_iframe=1')
            }
            if (history.replaceState) {
                history.replaceState(null, null, itemUrl)
            }
            this.$popupContentFrame.off('load').on('load', function() {
                this.lightboxContentLoaded()
            }.bind(this))
        },
        lightboxContentLoaded: function() {
            this.$popupContentPreloader.css('display', 'none');
            this.$popupContentFrame.contents().find('body').off('keyup.usCloseLightbox').on('keyup.usCloseLightbox', function(e) {
                if ($ush.toLowerCase(e.key) === 'escape') {
                    this.hideLightbox()
                }
            }.bind(this))
        },
        showLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.$popup.addClass('active');
            this.lightboxOpened = !0;
            this.$popupContentPreloader.css('display', 'block');
            $us.$html.addClass('usoverlay_fixed');
            if (!$.isMobile) {
                this.windowHasScrollbar = this._hasScrollbar();
                if (this.windowHasScrollbar && this._getScrollbarSize()) {
                    $us.$html.css('margin-right', this._getScrollbarSize())
                }
            }
            this.lightboxTimer = setTimeout(function() {
                this.afterShowLightbox()
            }.bind(this), 25)
        },
        afterShowLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.$container.on('keyup', function(e) {
                if (this.$container.hasClass('open_items_in_popup')) {
                    if ($ush.toLowerCase(e.key) === 'escape') {
                        this.hideLightbox()
                    }
                }
            }.bind(this));
            this.$popupBox.addClass('show');
            $us.$canvas.trigger('contentChange');
            $us.$window.trigger('resize')
        },
        hideLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.lightboxOpened = !1;
            this.$popupBox.removeClass('show');
            if (history.replaceState) {
                history.replaceState(null, null, this.originalURL)
            }
            this.lightboxTimer = setTimeout(function() {
                this.afterHideLightbox()
            }.bind(this), 500)
        },
        afterHideLightbox: function() {
            this.$container.off('keyup');
            clearTimeout(this.lightboxTimer);
            this.$popup.removeClass('active');
            this.$popupContentFrame.attr('src', 'about:blank');
            $us.$html.removeClass('usoverlay_fixed');
            if (!$.isMobile) {
                if (this.windowHasScrollbar) {
                    $us.$html.css('margin-right', '')
                }
            }
        },
        beforeAppendItems: function($items) {
            if ($('[data-content-height]', $items).length) {
                var handle = $ush.timeout(function() {
                    $('[data-content-height]', $items).usCollapsibleContent();
                    $ush.clearTimeout(handle)
                }, 1)
            }
        }
    };
    $.fn.wGrid = function(options) {
        return this.each(function() {
            $(this).data('wGrid', new $us.WGrid(this, options))
        })
    };
    $(function() {
        $('.w-grid').wGrid()
    });
    $('.w-grid-list').each(function() {
        var $list = $(this);
        if (!$list.find('[ref=magnificPopupGrid]').length) {
            return
        }
        var delegateStr = 'a[ref=magnificPopupGrid]:visible',
            popupOptions;
        if ($list.hasClass('owl-carousel')) {
            delegateStr = '.owl-item:not(.cloned) a[ref=magnificPopupGrid]'
        }
        popupOptions = {
            type: 'image',
            delegate: delegateStr,
            gallery: {
                enabled: !0,
                navigateByImgClick: !0,
                preload: [0, 1],
                tPrev: $us.langOptions.magnificPopup.tPrev,
                tNext: $us.langOptions.magnificPopup.tNext,
                tCounter: $us.langOptions.magnificPopup.tCounter
            },
            image: {
                titleSrc: 'aria-label'
            },
            removalDelay: 300,
            mainClass: 'mfp-fade',
            fixedContentPos: !0,
            callbacks: {
                beforeOpen: function() {
                    var owlCarousel = $list.data('owl.carousel');
                    if (owlCarousel && owlCarousel.settings.autoplay) {
                        $list.trigger('stop.owl.autoplay')
                    }
                },
                beforeClose: function() {
                    var owlCarousel = $list.data('owl.carousel');
                    if (owlCarousel && owlCarousel.settings.autoplay) {
                        $list.trigger('play.owl.autoplay')
                    }
                }
            }
        };
        $list.magnificPopup(popupOptions);
        if ($list.hasClass('owl-carousel')) {
            $list.on('initialized.owl.carousel', function(initEvent) {
                var $currentList = $(initEvent.currentTarget),
                    items = {};
                $('.owl-item:not(.cloned)', $currentList).each(function(_, item) {
                    var $item = $(item),
                        id = $item.find('[data-id]').data('id');
                    if (!items.hasOwnProperty(id)) {
                        items[id] = $item
                    }
                });
                $currentList.on('click', '.owl-item.cloned', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var id = $('[data-id]', e.currentTarget).data('id');
                    if (items.hasOwnProperty(id)) {
                        $('a[ref=magnificPopupGrid]', items[id]).trigger('click')
                    }
                })
            })
        }
    })
})(jQuery);
! function($, _undefined) {
    "use strict";
    const _document = document;
    const abs = Math.abs;

    function usGridFilter(container, options) {
        const self = this;
        self.filtersArgs = {};
        self.options = {
            filterPrefix: 'filter',
            gridNotFoundMessage: !1,
            gridPaginationSelector: '.w-grid-pagination',
            gridSelector: '.w-grid[data-filterable="true"]:first',
            layout: 'hor',
            mobileWidth: 600,
            use_grid: 'first'
        };
        self.$container = $(container);
        self.$filtersItem = $('.w-filter-item', container);
        if (self.$container.is('[onclick]')) {
            $.extend(self.options, self.$container[0].onclick() || {});
            if (!$us.usbPreview()) {
                self.$container.removeAttr('onclick')
            }
        }
        if (self.options.use_grid !== 'first') {
            const $use_grid = $(self.options.use_grid);
            if ($use_grid.length && $use_grid.hasClass('w-grid')) {
                self.$grid = $use_grid
            }
        }
        if ($ush.isUndefined(self.$grid)) {
            self.$grid = $('.l-main ' + self.options.gridSelector, $us.$canvas)
        }
        var $filtersArgs = $('.w-filter-json-filters-args:first', self.$container);
        if ($filtersArgs.length) {
            self.filtersArgs = $filtersArgs[0].onclick() || {};
            $filtersArgs.remove()
        }
        if (!self.$grid.length && self.options.gridNotFoundMessage) {
            self.$container.prepend('<div class="w-filter-message">' + self.options.gridNotFoundMessage + '</div>')
        }
        self._events = {
            changeFilter: self._changeFilter.bind(self),
            closeMobileFilters: self._closeMobileFilters.bind(self),
            openMobileFilters: self._openMobileFilters.bind(self),
            hideItemDropdown: self._hideItemDropdown.bind(self),
            loadPageNumber: self._loadPageNumber.bind(self),
            resetItemValues: self._resetItemValues.bind(self),
            resize: self._resize.bind(self),
            toggleItemSection: self._toggleItemSection.bind(self),
            showItemDropdown: self._showItemDropdown.bind(self),
            changeItemAtts: self._changeItemAtts.bind(self),
            updateItemsAmount: self._updateItemsAmount.bind(self),
            woocommerceOrdering: self._woocommerceOrdering.bind(self),
        };
        self.$grid.addClass('used_by_grid_filter');
        self.$container.on('click', '.w-filter-opener', self._events.openMobileFilters).on('click', '.w-filter-list-closer, .w-filter-list-panel > .w-btn', self._events.closeMobileFilters);
        self.$filtersItem.on('change', 'input, select', self._events.changeFilter).on('click', '.w-filter-item-reset', self._events.resetItemValues);
        $(self.options.gridPaginationSelector, self.$grid).on('click', '.page-numbers', self._events.loadPageNumber);
        $us.$window.on('resize load', $ush.debounce(self._events.resize, 10));
        self.on('changeItemAtts', self._events.changeItemAtts);
        if (self.$container.hasClass('drop_on_click')) {
            self.$filtersItem.on('click', '.w-filter-item-title', self._events.showItemDropdown);
            $(_document).on('mouseup', self._events.hideItemDropdown)
        }
        $us.$document.keyup(function(e) {
            if (e.keyCode == 27) {
                this._hideItemDropdown({})
            }
        }.bind(self));
        $('form.woocommerce-ordering', $us.$canvas).off('change', 'select.orderby').on('change', 'select.orderby', self._events.woocommerceOrdering);
        $('.ui-slider', self.$container).each(function(_, node) {
            var $node = $(node),
                $parent = $node.parent(),
                valueFormat = function(value) {
                    value = $ush.toString(value);
                    if (options.priceFormat) {
                        var priceFormat = $ush.toPlainObject(options.priceFormat),
                            decimals = $ush.parseInt(abs(priceFormat.decimals));
                        if (decimals) {
                            value = $ush.toString($ush.parseFloat(value).toFixed(decimals)).replace(/^(\d+)(\.)(\d+)$/, '$1' + priceFormat.decimal_separator + '$3')
                        }
                        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, priceFormat.thousand_separator)
                    }
                    return $ush.toString(options.unitFormat).replace('%d', value)
                },
                showRangeResult = function(e, ui) {
                    $('.for_min_value', $parent).html(valueFormat(ui.values[0]));
                    $('.for_max_value', $parent).html(valueFormat(ui.values[1]))
                };
            var options = $.extend(!0, {
                slider: {
                    animate: !0,
                    max: 100,
                    min: 0,
                    range: !0,
                    step: 1,
                    values: [0, 100],
                },
                unitFormat: '%d',
                priceFormat: null,
            }, node.onclick() || {});
            $node.data('defautlValues', [options.slider.min, options.slider.max].join('-')).removeAttr('onclick').slider($.extend(options.slider, {
                slide: showRangeResult,
                change: $ush.debounce(function(e, ui) {
                    showRangeResult(e, ui);
                    $('input[type=hidden]', $parent).val(ui.values.join('-')).trigger('change')
                }),
            }))
        });
        self.checkItemValues();
        self.$container.toggleClass('active', self.$filtersItem.hasClass('has_value'));
        self.on('us_grid_filter.update-items-amount', self._events.updateItemsAmount);
        self._events.resize();
        if (self.$container.hasClass('togglable')) {
            self.$filtersItem.on('click', '.w-filter-item-title', self._events.toggleItemSection)
        }
    };
    $.extend(usGridFilter.prototype, $us.mixins.Events, {
        isMobile: function() {
            return $ush.parseInt($us.$window.width()) <= $ush.parseInt(this.options.mobileWidth)
        },
        _changeFilter: function(e) {
            var self = this,
                $target = $(e.currentTarget),
                $item = $target.closest('.w-filter-item'),
                type = $ush.toString($item.usMod('type'));
            $item.removeClass('loading');
            self.$filtersItem.not($item).addClass('loading');
            if (['radio', 'checkbox'].indexOf(type) > -1) {
                if (type === 'radio') {
                    $('.w-filter-item-value', $item).removeClass('selected')
                }
                $target.closest('.w-filter-item-value').toggleClass('selected', $target.is(':checked '))
            } else if (type === 'range') {
                var $inputs = $('input[type!=hidden]', $item),
                    rangeValues = [];
                $inputs.each((i, input) => {
                    let $input = $(input),
                        value = $ush.parseInt(input.value),
                        name = $ush.toString(input.dataset.name);
                    if (!value && name == ['min_value', 'max_value'][i] && rangeValues.length == i) {
                        value = $input.attr('placeholder')
                    }
                    rangeValues.push($ush.parseInt(value))
                });
                rangeValues = rangeValues.join('-');
                $('input[type="hidden"]', $item).val(rangeValues !== '0-0' ? rangeValues : '')
            } else if (type === 'range_slider') {
                var $input = $('input[type="hidden"]', $item);
                if ($input.val() == $ush.toString($('.ui-slider', $item).data('defautlValues'))) {
                    $input.val('')
                }
            }
            var value = self.getValue();
            $ush.debounce_fn_1ms(self.URLSearchParams.bind(self, value));
            self.triggerGrid('us_grid.updateState', [value, 1, self]);
            self.trigger('changeItemAtts', $item);
            self.$container.toggleClass('active', self.$filtersItem.hasClass('has_value'))
        },
        _loadPageNumber: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this,
                $target = $(e.currentTarget),
                href = $ush.toString($target.attr('href')),
                page = $ush.parseInt((href.match(/page(=|\/)(\d+)(\/?)/) || [])[2] || 1);
            history.replaceState(_document.title, _document.title, href);
            self.triggerGrid('us_grid.updateState', [self.getValue(), page, self])
        },
        _resetItemValues: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this,
                $item = $(e.currentTarget).closest('.w-filter-item'),
                type = $ush.toString($item.usMod('type'));
            if (!type) {
                return
            }
            if (['checkbox', 'radio'].indexOf(type) > -1) {
                $('input:checked', $item).prop('checked', !1);
                $('input[value="*"]:first', $item).each(function(_, input) {
                    $(input).prop('checked', !0).closest('.w-filter-item').addClass('selected')
                })
            }
            if (type === 'range') {
                $('input', $item).val('')
            }
            if (type === 'dropdown') {
                $('option', $item).prop('selected', !1)
            }
            if (type === 'range_slider') {
                var $uiSlider = $('.ui-slider', $item);
                $uiSlider.slider('values', $ush.toString($uiSlider.data('defautlValues')).split('-'))
            }
            $('.w-filter-item-value', $item).removeClass('selected');
            self.trigger('changeItemAtts', $item);
            self.$container.toggleClass('active', self.$filtersItem.hasClass('has_value'));
            var value = self.getValue();
            $ush.debounce_fn_1ms(self.URLSearchParams.bind(self, value));
            self.URLSearchParams(value);
            self.triggerGrid('us_grid.updateState', [value, 1, self])
        },
        _changeItemAtts: function(_, item) {
            var self = this,
                $item = $(item),
                title = '',
                hasValue = !1,
                type = $ush.toString($item.usMod('type')),
                $selected = $('input:not([value="*"]):checked', $item);
            if (!type) {
                return
            }
            if (['checkbox', 'radio'].indexOf(type) > -1) {
                hasValue = $selected.length;
                if (self.options.layout == 'hor') {
                    var title = '';
                    if ($selected.length === 1) {
                        title += ': ' + $selected.nextAll('.w-filter-item-value-label:first').text()
                    } else if ($selected.length > 1) {
                        title += ': ' + $selected.length
                    }
                }
            }
            if (type === 'dropdown') {
                var value = $('select:first', $item).val();
                hasValue = (value !== '*') ? value : ''
            }
            if (type === 'range') {
                var value = $('input[type="hidden"]:first', $item).val();
                hasValue = value;
                if (self.options.layout == 'hor' && value) {
                    title += ': ' + value
                }
            }
            if (type === 'range_slider') {
                var value = $('input[type="hidden"]:first', $item).val();
                hasValue = value && value != $ush.toString($('.ui-slider', $item).data('defautlValues'))
            }
            $item.toggleClass('has_value', !!hasValue);
            if (self.$container.hasClass('togglable') && hasValue) {
                $item.addClass('expand')
            }
            $('> .w-filter-item-title > span:not(.w-filter-item-reset)', item).html(title)
        },
        _resize: function() {
            var self = this;
            self.$container.usMod('state', self.isMobile() ? 'mobile' : 'desktop');
            if (!self.isMobile()) {
                $us.$body.removeClass('us_filter_open');
                self.$container.removeClass('open_for_mobile')
            }
        },
        _openMobileFilters: function() {
            $us.$body.addClass('us_filter_open');
            this.$container.addClass('open_for_mobile')
        },
        _closeMobileFilters: function() {
            $us.$body.removeClass('us_filter_open');
            this.$container.removeClass('open_for_mobile')
        },
        _showItemDropdown: function(e) {
            this._hideItemDropdown(e);
            $(e.currentTarget).closest('.w-filter-item').addClass('dropped')
        },
        _hideItemDropdown: function(e) {
            var self = this;
            if (self.$filtersItem.hasClass('dropped')) {
                self.$filtersItem.filter('.dropped').each(function(_, node) {
                    var $node = $(node);
                    if (!$node.is(e.target) && $node.has(e.target).length === 0) {
                        $node.removeClass('dropped')
                    }
                })
            }
        },
        _toggleItemSection: function(e) {
            $(e.currentTarget).closest('.w-filter-item').toggleClass('expand')
        },
        _woocommerceOrdering: function(e) {
            e.stopPropagation();
            var self = this,
                $form = $(e.currentTarget).closest('form');
            $('input[name^="' + self.options.filterPrefix + '"]', $form).remove();
            $.each(self.getValue().split('&'), function(_, value) {
                value = value.split('=');
                if (value.length === 2) {
                    $form.append('<input type="hidden" name="' + value[0] + '" value="' + value[1] + '"/>')
                }
            });
            $form.trigger('submit')
        },
        _updateItemsAmount: function(_, data) {
            const self = this;
            $.each((data.taxonomies_query_args || {}), function(key, items) {
                var $item = self.$filtersItem.filter('[data-source="' + key + '"]'),
                    type = $ush.toString($item.usMod('type')),
                    numActiveValues = 0;
                $.each(items, function(value, amount) {
                    var disabled = !amount;
                    if (!disabled) {
                        numActiveValues++
                    }
                    if (type === 'dropdown') {
                        var $option = $('select:first option[value="' + value + '"]', $item),
                            template = $option.data('template') || '';
                        if (template) {
                            template = template.replace('%s', (amount ? '(' + amount + ')' : ''));
                            $option.text(template)
                        }
                        $option.prop('disabled', disabled).toggleClass('disabled', disabled)
                    } else {
                        var $input = $('input[value="' + value + '"]', $item);
                        $input.prop('disabled', disabled).nextAll('.w-filter-item-value-amount').text(amount);
                        $input.closest('.w-filter-item-value').toggleClass('disabled', disabled);
                        if (disabled && $input.is(':checked')) {
                            $input.prop('checked', !1)
                        }
                    }
                });
                $item.removeClass('loading');
                $item.toggleClass('disabled', numActiveValues < 1)
            });
            if (data.hasOwnProperty('wc_min_max_price') && data.wc_min_max_price instanceof Object) {
                const $price = self.$filtersItem.filter('[data-source$="|_price"]');
                $.each((data.wc_min_max_price || {}), function(name, value) {
                    var $input = $('input.type_' + name, $price);
                    $input.attr('placeholder', value ? value : $input.attr('aria-label'))
                });
                $price.removeClass('loading')
            }
            if (!$.isEmptyObject(data)) {
                if (self.handle) {
                    $ush.clearTimeout(self.handle)
                }
                self.handle = $ush.timeout(function() {
                    $ush.debounce_fn_1ms(self.URLSearchParams.bind(self, self.getValue()));
                    self.checkItemValues()
                }, 100)
            }
        },
        triggerGrid: function(eventType, extraParams) {
            $ush.debounce_fn_10ms(function() {
                $us.$body.trigger(eventType, extraParams)
            })
        },
        checkItemValues: function() {
            var self = this;
            self.$filtersItem.each(function(_, node) {
                self.trigger('changeItemAtts', node)
            })
        },
        getValue: function() {
            var value = '',
                filters = {};
            $.each(this.$container.serializeArray(), function(_, filter) {
                if (filter.value === '*' || !filter.value) {
                    return
                }
                if (!filters.hasOwnProperty(filter.name)) {
                    filters[filter.name] = []
                }
                filters[filter.name].push(filter.value)
            });
            for (var k in filters) {
                if (value) {
                    value += '&'
                }
                if (Array.isArray(filters[k])) {
                    value += k + '=' + filters[k].join(',')
                }
            }
            return encodeURI(value);
        },
        URLSearchParams: function(params) {
            var url = location.origin + location.pathname + (location.pathname.slice(-1) != '/' ? '/' : ''),
                search = location.search.replace(new RegExp(this.options.filterPrefix + "(.+?)(&|$)", "g"), '');
            if (!search || search.substr(0, 1) !== '?') {
                search += '?'
            } else if ('?&'.indexOf(search.slice(-1)) === -1) {
                search += '&'
            }
            if (!params && '?&'.indexOf(search.slice(-1)) !== -1) {
                search = search.slice(0, -1)
            }
            history.replaceState(_document.title, _document.title, url + search + params)
        }
    });
    $.fn.usGridFilter = function(options) {
        return this.each(function() {
            $(this).data('usGridFilter', new usGridFilter(this, options))
        })
    };
    $(function() {
        $('.w-filter.for_grid', $us.$canvas).usGridFilter()
    })
}(jQuery);
! function($, undefined) {
    "use strict";
    var _window = window,
        _undefined = undefined;
    _window.$ush = _window.$ush || {};
    _window.$us.canvas = _window.$us.canvas || {};

    function toBoolean(value) {
        if (typeof value == 'boolean') {
            return value
        }
        if (typeof value == 'string') {
            value = value.trim();
            return value.toLocaleLowerCase() == 'true' || value == '1'
        }
        return !!parseInt(value)
    }

    function USHeader(settings) {
        var self = this;
        self.$container = $('.l-header', $us.$canvas);
        self.$showBtn = $('.w-header-show:first', $us.$body);
        self.settings = settings || {};
        self.state = 'default';
        self.$elms = {};
        self.canvasOffset = 0;
        self.bodyHeight = $us.$body.height();
        self.adminBarHeight = 0;
        self._states = {
            init_height: 0,
            scroll_direction: 'down',
            sticky: !1,
            sticky_auto_hide: !1,
            vertical_scrollable: !1
        };
        if (self.$container.length === 0) {
            return
        }
        self._states.init_height = self.getHeight();
        self.$places = {
            hidden: $('.l-subheader.for_hidden', self.$container)
        };
        self.breakpoints = {
            laptops: 1280,
            tablets: 1024,
            mobiles: 600
        };
        for (var k in self.breakpoints) {
            self.breakpoints[k] = parseInt(((settings[k] || {}).options || {}).breakpoint) || self.breakpoints[k]
        }
        $('.l-subheader-cell', self.$container).each(function(_, place) {
            var $place = $(place),
                key = $place.parent().parent().usMod('at') + '_' + $place.usMod('at');
            self.$places[key] = $place
        });
        $('[class*=ush_]', self.$container).each(function(_, elm) {
            var $elm = $(elm),
                matches = /(^| )ush_([a-z_]+)_([0-9]+)(\s|$)/.exec(elm.className);
            if (!matches) {
                return
            }
            var id = matches[2] + ':' + matches[3];
            self.$elms[id] = $elm;
            if ($elm.is('.w-vwrapper, .w-hwrapper')) {
                self.$places[id] = $elm
            }
        });
        $us.$window.on('scroll.noPreventDefault', $ush.debounce(self._events.scroll.bind(self), 1)).on('resize load', $ush.debounce(self._events.resize.bind(self), 1));
        self.$container.on('contentChange', self._events.contentChange.bind(self));
        self.$showBtn.on('click', self._events.showBtn.bind(self));
        self.on('changeSticky', self._events._changeSticky.bind(self)).on('swichVerticalScrollable', self._events._swichVerticalScrollable.bind(self));
        self.setState('default', !0);
        self._events.resize.call(self);
        if (self.isStickyAutoHideEnabled()) {
            self.$container.addClass('sticky_auto_hide')
        }
        self.$container.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', $ush.debounce(function() {
            self.trigger.call(self, 'transitionEnd')
        }, 1))
    }
    $.extend(USHeader.prototype, $us.mixins.Events, {
        prevScrollTop: 0,
        currentStateIs: function(state) {
            var self = this;
            return (state && (['default'].concat(Object.keys(self.breakpoints))).indexOf(state) !== -1 && self.state === state)
        },
        isVertical: function() {
            return this.orientation === 'ver'
        },
        isHorizontal: function() {
            return this.orientation === 'hor'
        },
        isFixed: function() {
            return this.pos === 'fixed'
        },
        isStatic: function() {
            return this.pos === 'static'
        },
        isTransparent: function() {
            return this.bg === 'transparent'
        },
        _isWithinScrollBoundaries: function(scrollTop) {
            scrollTop = Math.ceil(scrollTop);
            return (scrollTop + _window.innerHeight >= $us.$document.height()) || scrollTop <= 0
        },
        isHidden: function() {
            return !!$us.header.settings.is_hidden
        },
        isStickyEnabled: function() {
            var self = this;
            return ((self.settings[self.state] || {}).options || {}).sticky || !1
        },
        isStickyAutoHideEnabled: function() {
            var self = this;
            return self.isStickyEnabled() && (((self.settings[self.state] || {}).options || {}).sticky_auto_hide || !1)
        },
        isSticky: function() {
            return this._states.sticky || !1
        },
        isStickyAutoHidden: function() {
            return this._states.sticky_auto_hide || !1
        },
        getHeaderInitialPos: function() {
            return $us.$body.usMod('headerinpos') || ''
        },
        getScrollDirection: function() {
            return this._states.scroll_direction || 'down'
        },
        getHeight: function() {
            var self = this;
            if (!self.$container.length) {
                return 0
            }
            var beforeContent = getComputedStyle(self.$container.get(0), ':before').content,
                height = 0;
            if (beforeContent && ['none', 'auto'].indexOf(beforeContent) === -1) {
                height = beforeContent.replace(/[^+\d]/g, '')
            }
            if (!height) {
                height = self.$container.outerHeight()
            }
            return !isNaN(height) ? $ush.parseFloat(height) : 0
        },
        getInitHeight: function() {
            var self = this;
            return parseInt(self._states.init_height) || self.getHeight()
        },
        getCurrentHeight: function(adminBar) {
            var self = this,
                height = 0;
            if (adminBar && self.isHorizontal() && (!self.currentStateIs('mobiles') || (self.adminBarHeight && self.adminBarHeight >= self.getScrollTop()))) {
                height += self.adminBarHeight
            }
            if (!self.isStickyAutoHidden()) {
                height += self.getHeight()
            }
            return height
        },
        getScrollTop: function() {
            return $us.$window.scrollTop() || this.prevScrollTop
        },
        prevOffsetTop: 0,
        getOffsetTop: function() {
            var self = this;
            var top = parseFloat(self.$container.css('top') || 0);
            return (self.prevOffsetTop = Math.max(self.prevOffsetTop, top))
        },
        isScrollAtTopPosition: function() {
            return $ush.parseInt($us.$window.scrollTop()) === 0
        },
        setState: function(state, force) {
            var self = this;
            if (!force && self.currentStateIs(state)) {
                return
            }
            var options = (self.settings[state] || {}).options || {},
                orientation = options.orientation || 'hor',
                pos = toBoolean(options.sticky) ? 'fixed' : 'static',
                bg = toBoolean(options.transparent) ? 'transparent' : 'solid',
                shadow = options.shadow || 'thin';
            if (orientation === 'ver') {
                pos = 'fixed';
                bg = 'solid'
            }
            self._setOrientation(orientation);
            self._setPos(pos);
            self._setBg(bg);
            self._setShadow(shadow);
            self._setLayout((self.settings[state] || {}).layout || {});
            $us.$body.usMod('state', self.state = state);
            if (self.currentStateIs('default') || self.currentStateIs('laptops')) {
                $us.$body.removeClass('header-show')
            }
            if ($us.nav !== _undefined) {
                $us.nav.resize()
            }
            if (self.isStickyAutoHideEnabled()) {
                self.$container.removeClass('down')
            }
        },
        _setPos: function(pos) {
            var self = this;
            if (pos === self.pos) {
                return
            }
            self.$container.usMod('pos', self.pos = pos);
            if (self.pos === 'static') {
                self.trigger('changeSticky', !1)
            }
        },
        _setBg: function(bg) {
            var self = this;
            if (bg != self.bg) {
                self.$container.usMod('bg', self.bg = bg)
            }
        },
        _setShadow: function(shadow) {
            var self = this;
            if (shadow != self.shadow) {
                self.$container.usMod('shadow', self.shadow = shadow)
            }
        },
        _setLayout: function(layout) {
            var self = this;
            for (var place in layout) {
                if (!layout[place] || !self.$places[place]) {
                    if (place.indexOf('wrapper') > -1) {
                        self.$places[place] = self.$places.hidden
                    } else {
                        continue
                    }
                }
                self._placeElements(layout[place], self.$places[place]);
            }
        },
        _setOrientation: function(orientation) {
            var self = this;
            if (orientation != self.orientation) {
                $us.$body.usMod('header', self.orientation = orientation)
            }
        },
        _placeElements: function(elms, $place) {
            var self = this;
            for (var i = 0; i < elms.length; i++) {
                var elmId;
                if (typeof elms[i] == 'object') {
                    elmId = elms[i][0];
                    if (!self.$places[elmId] || !self.$elms[elmId]) {
                        continue
                    }
                    self.$elms[elmId].appendTo($place);
                    self._placeElements(elms[i].shift(), self.$places[elmId])
                } else {
                    elmId = elms[i];
                    if (!self.$elms[elmId]) {
                        continue
                    }
                    self.$elms[elmId].appendTo($place)
                }
            }
        },
        _isVerticalScrollable: function() {
            var self = this;
            if (!self.isVertical()) {
                return
            }
            if ((self.currentStateIs('default') || self.currentStateIs('laptops')) && self.isFixed()) {
                self.$container.addClass('scrollable');
                var headerHeight = self.getHeight(),
                    canvasHeight = parseInt($us.canvas.winHeight),
                    documentHeight = parseInt($us.$document.height());
                self.$container.removeClass('scrollable');
                if ((headerHeight / canvasHeight) > 1.05) {
                    self.trigger('swichVerticalScrollable', !0)
                } else if (self._states.vertical_scrollable) {
                    self.trigger('swichVerticalScrollable', !1)
                }
                if ((headerHeight / documentHeight) > 1.05) {
                    self.$container.css({
                        position: 'absolute',
                        top: 0
                    })
                }
            } else if (self._states.vertical_scrollable) {
                self.trigger('swichVerticalScrollable', !1)
            }
        },
        _events: {
            _swichVerticalScrollable: function(_, state) {
                var self = this;
                self.$container.toggleClass('scrollable', self._states.vertical_scrollable = !!state);
                if (!self._states.vertical_scrollable) {
                    self.$container.resetInlineCSS('position', 'top', 'bottom');
                    delete self._headerScrollRange
                }
            },
            _changeSticky: function(_, state) {
                var self = this;
                self._states.sticky = !!state;
                var currentHeight = self.getCurrentHeight(!0),
                    resetCss = ['position', 'top', 'bottom'];
                if ($us.canvas.hasStickyFirstSection() && self.getHeaderInitialPos() == 'bottom' && !self.isStickyAutoHideEnabled()) {
                    resetCss = resetCss.filter(function(value) {
                        return value !== 'top'
                    })
                }
                self.$container.toggleClass('sticky', self._states.sticky).resetInlineCSS(resetCss);
                if (currentHeight == self.getCurrentHeight(!0)) {
                    self.trigger('transitionEnd')
                }
            },
            contentChange: function() {
                var self = this;
                self._isVerticalScrollable.call(self)
            },
            showBtn: function(e) {
                var self = this;
                if ($us.$body.hasClass('header-show')) {
                    return
                }
                e.stopPropagation();
                $us.$body.addClass('header-show').on(($.isMobile ? 'touchstart.noPreventDefault' : 'click'), self._events.hideMobileVerticalHeader.bind(self))
            },
            hideMobileVerticalHeader: function(e) {
                var self = this;
                if ($.contains(self.$container[0], e.target)) {
                    return
                }
                $us.$body.off(($.isMobile ? 'touchstart' : 'click'), self._events.hideMobileVerticalHeader.bind(self));
                $ush.timeout(function() {
                    $us.$body.removeClass('header-show')
                }, 10)
            },
            scroll: function() {
                var self = this,
                    scrollTop = self.getScrollTop(),
                    headerAbovePosition = (self.getHeaderInitialPos() === 'above');
                if (self.prevScrollTop != scrollTop) {
                    self._states.scroll_direction = (self.prevScrollTop <= scrollTop) ? 'down' : 'up'
                }
                self.prevScrollTop = scrollTop;
                if (self.isScrollAtTopPosition()) {
                    self._states.scroll_direction = 'up'
                }
                if (self.isStickyAutoHideEnabled() && self.isSticky() && !self._isWithinScrollBoundaries(scrollTop) && !headerAbovePosition) {
                    self._states.sticky_auto_hide = (self.getScrollDirection() === 'down');
                    self.$container.toggleClass('down', self._states.sticky_auto_hide)
                }
                if (!self.isFixed()) {
                    return
                }
                var headerAttachedFirstSection = ['bottom', 'below'].indexOf(self.getHeaderInitialPos()) !== -1;
                if (self.isHorizontal() && (headerAbovePosition || (headerAttachedFirstSection && (self.currentStateIs('tablets') || self.currentStateIs('mobiles'))) || !headerAttachedFirstSection)) {
                    if (self.isStickyEnabled()) {
                        var scrollBreakpoint = parseInt(((self.settings[self.state] || {}).options || {}).scroll_breakpoint) || 100,
                            isSticky = Math.ceil(scrollTop) >= scrollBreakpoint;
                        if (isSticky != self.isSticky()) {
                            self.trigger('changeSticky', isSticky)
                        }
                    }
                    if (self.isSticky()) {
                        if (!$us.$window.scrollTop()) {
                            self.trigger('changeSticky', !1)
                        }
                    }
                }
                if (self.isHorizontal() && headerAttachedFirstSection && !headerAbovePosition && (self.currentStateIs('default') || self.currentStateIs('laptops'))) {
                    var top = ($us.canvas.getHeightFirstSection() + self.adminBarHeight);
                    if (self.getHeaderInitialPos() == 'bottom') {
                        top -= self.getInitHeight()
                    }
                    if (self.isStickyEnabled()) {
                        var isSticky = scrollTop >= top;
                        if (isSticky != self.isSticky()) {
                            self.trigger('changeSticky', isSticky)
                        }
                    }
                    if (!self.isSticky() && top != self.getOffsetTop()) {
                        self.$container.css('top', top)
                    }
                }
                if (self.isVertical() && !headerAttachedFirstSection && !headerAbovePosition && self._states.vertical_scrollable) {
                    var headerHeight = self.getHeight(),
                        documentHeight = parseInt($us.$document.height());
                    if (documentHeight > headerHeight) {
                        var canvasHeight = parseInt($us.canvas.winHeight) + self.canvasOffset,
                            scrollRangeDiff = (headerHeight - canvasHeight),
                            cssProps;
                        if (self._headerScrollRange === _undefined) {
                            self._headerScrollRange = [0, scrollRangeDiff]
                        }
                        if (self.bodyHeight > headerHeight) {
                            if (scrollTop < self._headerScrollRange[0]) {
                                self._headerScrollRange[0] = Math.max(0, scrollTop);
                                self._headerScrollRange[1] = (self._headerScrollRange[0] + scrollRangeDiff);
                                cssProps = {
                                    position: 'fixed',
                                    top: self.adminBarHeight
                                }
                            } else if (self._headerScrollRange[0] < scrollTop && scrollTop < self._headerScrollRange[1]) {
                                cssProps = {
                                    position: 'absolute',
                                    top: self._headerScrollRange[0]
                                }
                            } else if (self._headerScrollRange[1] <= scrollTop) {
                                self._headerScrollRange[1] = Math.min(documentHeight - canvasHeight, scrollTop);
                                self._headerScrollRange[0] = (self._headerScrollRange[1] - scrollRangeDiff);
                                cssProps = {
                                    position: 'fixed',
                                    top: (canvasHeight - headerHeight)
                                }
                            }
                        } else {
                            cssProps = {
                                position: 'absolute',
                                top: self.adminBarHeight,
                            }
                        }
                        if (cssProps) {
                            self.$container.css(cssProps)
                        }
                    }
                }
            },
            resize: function() {
                var self = this;
                var newState = 'default';
                for (var state in self.breakpoints) {
                    if (_window.innerWidth <= self.breakpoints[state]) {
                        newState = state
                    } else {
                        break
                    }
                }
                self.setState(newState || 'default', !1);
                self.canvasOffset = $us.$window.outerHeight() - $us.$window.innerHeight();
                self.bodyHeight = $us.$body.height();
                self.adminBarHeight = $us.getAdminBarHeight() || 0;
                if (self.isFixed() && self.isHorizontal()) {
                    self.$container.addClass('notransition');
                    $ush.timeout(function() {
                        self.$container.removeClass('notransition')
                    }, 50)
                }
                self._isVerticalScrollable.call(self);
                self._events.scroll.call(self)
            }
        }
    });
    window.USHeader = USHeader;
    $us.header = new USHeader($us.headerSettings || {})
}(window.jQuery);
! function($, _undefined) {
    "use strict";

    function usImageSlider(container) {
        let self = this,
            $container = $(container),
            $frame = $('.w-slider-h', container),
            $royalSlider = $('.royalSlider', container),
            options = {};
        if (!$.fn.royalSlider || $container.data('usImageSlider')) {
            return
        }
        let $jsonData = $('.w-slider-json', container);
        if ($jsonData.length) {
            $.extend(options, $jsonData[0].onclick() || {})
        }
        $jsonData.remove();
        if ($container.parent().hasClass('w-post-elm')) {
            options.imageScaleMode = 'fill'
        }
        options.usePreloader = !1;
        $royalSlider.royalSlider(options);
        let royalSlider = $royalSlider.data('royalSlider');
        if (options.fullscreen && options.fullscreen.enabled) {
            var rsEnterFullscreen = function() {
                $royalSlider.appendTo($us.$body);
                royalSlider.ev.off('rsEnterFullscreen', rsEnterFullscreen);
                royalSlider.ev.on('rsExitFullscreen', rsExitFullscreen);
                royalSlider.updateSliderSize()
            };
            royalSlider.ev.on('rsEnterFullscreen', rsEnterFullscreen);
            var rsExitFullscreen = function() {
                $royalSlider.prependTo($frame);
                royalSlider.ev.off('rsExitFullscreen', rsExitFullscreen);
                royalSlider.ev.on('rsEnterFullscreen', rsEnterFullscreen)
            }
        }
        royalSlider.ev.on('rsAfterContentSet', function() {
            royalSlider.slides.forEach(function(slide) {
                $(slide.content.find('img')[0]).attr('alt', slide.caption.attr('data-alt'))
            })
        });
        $us.$canvas.on('contentChange', function() {
            $royalSlider.parent().imagesLoaded(function() {
                royalSlider.updateSliderSize()
            })
        });
        self.royalSlider = royalSlider
    };
    $.fn.usImageSlider = function() {
        return this.each(function() {
            $(this).data('usImageSlider', new usImageSlider(this))
        })
    };
    $(() => {
        $('.w-slider').usImageSlider()
    });
    $us.$document.on('usPostList.itemsLoaded usGrid.itemsLoaded', (_, $items) => {
        $('.w-slider', $items).usImageSlider()
    })
}(jQuery);
! function($) {
    $us.Nav = function(container, options) {
        this.init(container, options)
    };
    $us.mobileNavOpened = 0;
    $us.Nav.prototype = {
        init: function(container, options) {
            this.$nav = $(container);
            if (!this.$nav.length) {
                return
            }
            this.$mobileMenuToggler = this.$nav.find('.w-nav-control');
            this.$mobileMenuCloser = this.$nav.find('.w-nav-close');
            this.$items = this.$nav.find('.menu-item');
            this.$list = this.$nav.find('.w-nav-list.level_1');
            this.$parentItems = this.$list.find('.menu-item-has-children');
            this.$subLists = this.$list.find('.menu-item-has-children > .w-nav-list');
            this.$anchors = this.$nav.find('.w-nav-anchor');
            this.$arrows = $('.w-nav-arrow');
            this.$reusableBlocksLinks = this.$nav.find('.menu-item-object-us_page_block a');
            this.type = this.$nav.usMod('type');
            this.layout = this.$nav.usMod('layout');
            this.isMobileMenuOpened = !1;
            this.options = {};
            const $navOptions = $('.w-nav-options:first', this.$nav);
            if ($navOptions.is('[onclick]')) {
                $.extend(this.options, $navOptions[0].onclick() || {});
                $navOptions.remove()
            }
            if (this.$reusableBlocksLinks.length !== 0) {
                this.$reusableBlocksLinks.each((index, element) => {
                    let $element = $(element);
                    if (!$element.parents('.w-popup-wrap').length) {
                        this.$anchors.push(element)
                    }
                })
            }
            if ($.isMobile && this.type === 'desktop') {
                this.$list.on('click', '.w-nav-anchor[class*="level_"]', (e) => {
                    const $target = $(e.currentTarget);
                    const $item = $target.closest('.menu-item');
                    if ($target.usMod('level') > 1 && !$item.hasClass('menu-item-has-children')) {
                        $target.parents('.menu-item.opened').removeClass('opened')
                    }
                })
            }
            this.$mobileMenuToggler.on('click', (e) => {
                e.preventDefault();
                this.isMobileMenuOpened = !this.isMobileMenuOpened;
                $us.$document.on('mouseup touchend.noPreventDefault', this._events.closeOnClickOutside);
                this.$anchors.each(function() {
                    if (!$(this).attr('href')) {
                        $(this).attr('href', 'javascript:void(0)')
                    }
                });
                if (this.isMobileMenuOpened) {
                    $('.l-header .w-nav').not(container).each(function() {
                        $(this).trigger('USNavClose')
                    });
                    this.$mobileMenuToggler.addClass('active').focus();
                    this.$items.filter('.opened').removeClass('opened');
                    this.$subLists.resetInlineCSS('display', 'height');
                    if (this.layout === 'dropdown') {
                        this.$list.slideDownCSS(250, () => $us.header.$container.trigger('contentChange'))
                    }
                    $us.$html.addClass('w-nav-open');
                    this.$mobileMenuToggler.attr('aria-expanded', 'true');
                    $us.mobileNavOpened++;
                    $us.$document.on('focusin', this._events.closeMobileMenuOnTab)
                } else {
                    this._events.closeMobileMenu()
                }
                $us.$canvas.trigger('contentChange')
            });
            this.$mobileMenuToggler.on('mouseup', () => {
                if ($ush.isSafari) {
                    this.$mobileMenuToggler.attr('style', 'outline: none')
                }
            });
            this.$mobileMenuCloser.on('click', () => {
                this._events.closeMobileMenu()
            });
            $us.$document.on('keydown', (e) => {
                if ($ush.isSafari) {
                    this.$mobileMenuToggler.removeAttr('style')
                }
                if (e.keyCode === 27 && this.type === 'mobile' && this.isMobileMenuOpened) {
                    this._events.closeMobileMenu()
                }
                if (e.keyCode === 9 && this.type === 'desktop' && !$(e.target).closest('.w-nav').length) {
                    this.$items.removeClass('opened')
                }
            });
            this._events = {
                closeMobileMenu: () => {
                    if (this.type !== 'mobile') {
                        return
                    }
                    this.isMobileMenuOpened = !1;
                    this.$mobileMenuToggler.removeClass('active');
                    $us.$html.removeClass('w-nav-open');
                    this.$mobileMenuToggler.attr('aria-expanded', 'false');
                    if (this.$list && this.layout === 'dropdown') {
                        this.$list.slideUpCSS(250)
                    }
                    $us.mobileNavOpened--;
                    this.$mobileMenuToggler.focus();
                    $us.$canvas.trigger('contentChange');
                    $us.$document.off('focusin', this._events.closeMobileMenuOnTab);
                    $us.$document.off('mouseup touchend.noPreventDefault', this._events.closeOnClickOutside)
                },
                toggleMobileSubMenu: ($item, show) => {
                    if (this.type !== 'mobile') {
                        return
                    }
                    const $sublist = $item.children('.w-nav-list');
                    if (show) {
                        $item.addClass('opened');
                        $sublist.slideDownCSS(250, () => $us.header.$container.trigger('contentChange'))
                    } else {
                        $item.removeClass('opened');
                        $sublist.slideUpCSS(250, () => $us.header.$container.trigger('contentChange'))
                    }
                },
                clickHandler: (e) => {
                    if (this.type !== 'mobile') {
                        return
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    const $item = $(e.currentTarget).closest('.menu-item');
                    this._events.toggleMobileSubMenu($item, !$item.hasClass('opened'))
                },
                keyDownHandler: (e) => {
                    const keyCode = e.keyCode || e.which;
                    const $target = $(e.target);
                    const $item = $target.closest('.menu-item');
                    const $mainItem = $target.closest('.menu-item.level_1');
                    const $parentItem = $target.closest('.menu-item-has-children');
                    if (this.type !== 'mobile') {
                        if ((keyCode === 13 || keyCode === 32) && $target.is(this.$arrows)) {
                            e.preventDefault();
                            $us.$document.off('mouseup touchend.noPreventDefault', this._events.closeOnClickOutside).one('mouseup touchend.noPreventDefault', this._events.closeOnClickOutside);
                            this.$parentItems.off('mouseover', this._events.closeOnMouseIn).one('mouseover', this._events.closeOnMouseIn);
                            if (!$parentItem.hasClass('opened')) {
                                $parentItem.addClass('opened').siblings().removeClass('opened');
                                this.$parentItems.not($parentItem).not($mainItem).removeClass('opened')
                            } else {
                                $parentItem.removeClass('opened')
                            }
                        }
                        if (keyCode === 27) {
                            if ($mainItem.hasClass('opened')) {
                                $mainItem.find('.w-nav-arrow').first().focus()
                            }
                            this.$items.removeClass('opened')
                        }
                    } else {
                        if ((keyCode === 13 || keyCode === 32) && $target.is(this.$arrows)) {
                            e.stopPropagation();
                            e.preventDefault();
                            this._events.toggleMobileSubMenu($item, !$item.hasClass('opened'))
                        }
                        if (keyCode === 9) {
                            let i = this.$anchors.index($target);
                            if (e.shiftKey && i === 0) {
                                this._events.closeMobileMenu()
                            }
                        }
                    }
                },
                closeMobileMenuOnTab: () => {
                    if (!$.contains(this.$nav[0], $us.$document[0].activeElement)) {
                        this._events.closeMobileMenu()
                    }
                },
                resize: this.resize.bind(this),
                detachAnimation: () => {
                    this.$nav.removeClass('us_animate_this')
                },
                closeOnClickOutside: (e) => {
                    if (this.isMobileMenuOpened && this.type === 'mobile') {
                        if (!this.$mobileMenuToggler.is(e.target) && !this.$mobileMenuToggler.has(e.target).length && !this.$list.is(e.target) && !this.$list.has(e.target).length) {
                            this._events.closeMobileMenu()
                        }
                    } else {
                        if (!$.contains(this.$nav[0], e.target)) {
                            this.$parentItems.removeClass('opened')
                        }
                    }
                },
                closeOnMouseIn: (e) => {
                    if (this.type === 'mobile') {
                        return
                    }
                    const $target = $(e.target);
                    const $parentItem = $target.closest('.menu-item-has-children');
                    const $mainItem = $target.closest('.menu-item.level_1');
                    this.$parentItems.not($parentItem).not($mainItem).removeClass('opened')
                }
            };
            this.$parentItems.each((index, element) => {
                const $element = $(element);
                const $arrow = $('.w-nav-arrow', $element).first();
                const $subAnchor = $element.find('.w-nav-anchor').first();
                const dropByLabel = $element.hasClass('mobile-drop-by_label') || $element.parents('.menu-item').hasClass('mobile-drop-by_label');
                const dropByArrow = $element.hasClass('mobile-drop-by_arrow') || $element.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (dropByLabel || (this.options.mobileBehavior && !dropByArrow)) {
                    $subAnchor.on('click', this._events.clickHandler)
                } else {
                    $arrow.on('click', this._events.clickHandler);
                    $arrow.on('click', this._events.keyDownHandler)
                }
            });
            this.$parentItems.each((_, element) => {
                const $element = $(element);
                const $parentItem = $element.parent().closest('.menu-item');
                if (!$parentItem.length || $parentItem.usMod('columns') === !1) {
                    $element.addClass('togglable')
                }
            });
            if (!$us.$html.hasClass('no-touch')) {
                this.$list.find('.menu-item-has-children.togglable > .w-nav-anchor').on('click', (e) => {
                    if (this.type === 'mobile') {
                        return
                    }
                    e.preventDefault();
                    const $this = $(e.currentTarget);
                    const $item = $this.parent();
                    if ($item.hasClass('opened')) {
                        return location.assign($this.attr('href'))
                    }
                    $item.addClass('opened');
                    const outsideClickEvent = (e) => {
                        if ($.contains($item[0], e.target)) {
                            return
                        }
                        $item.removeClass('opened');
                        $us.$body.off('touchstart', outsideClickEvent)
                    };
                    $us.$body.on('touchstart.noPreventDefault', outsideClickEvent)
                })
            }
            this.$nav.on('keydown.upsolution', this._events.keyDownHandler);
            this.$nav.on('transitionend', this._events.detachAnimation);
            this.$anchors.on('click', (e) => {
                const $item = $(e.currentTarget).closest('.menu-item');
                const dropByLabel = $item.hasClass('mobile-drop-by_label') || $item.parents('.menu-item').hasClass('mobile-drop-by_label');
                const dropByArrow = $item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (this.type !== 'mobile' || $us.header.isVertical()) {
                    return
                }
                if (dropByLabel || (this.options.mobileBehavior && $item.hasClass('menu-item-has-children') && !dropByArrow)) {
                    return
                }
                this._events.closeMobileMenu()
            });
            $us.$window.on('resize', $ush.debounce(this._events.resize, 5));
            $ush.timeout(() => {
                this.resize();
                $us.header.$container.trigger('contentChange')
            }, 50);
            this.$nav.on('USNavClose', this._events.closeMobileMenu)
        },
        resize: function() {
            if (!this.$nav.length) {
                return
            }
            const nextType = (window.innerWidth < this.options.mobileWidth) ? 'mobile' : 'desktop';
            if ($us.header.orientation !== this.headerOrientation || nextType !== this.type) {
                this.$subLists.resetInlineCSS('display', 'height');
                if (this.headerOrientation === 'hor' && this.type === 'mobile') {
                    this.$list.resetInlineCSS('display', 'height', 'max-height', 'opacity')
                }
                this.$items.removeClass('opened');
                this.headerOrientation = $us.header.orientation;
                this.type = nextType;
                this.$nav.usMod('type', nextType)
            }
            this.$list.removeClass('hide_for_mobiles')
        }
    };
    $.fn.usNav = function(options) {
        return this.each(function() {
            $(this).data('usNav', new $us.Nav(this, options))
        })
    };
    $('.l-header .w-nav').usNav()
}(jQuery);
! function($) {
    "use strict";
    $us.UsSharing = function(container, options) {
        this.init(container, options)
    };
    $us.UsSharing.prototype = {
        init: function(container, options) {
            this.$container = $(container);
            if (!!$('.w-sharing-list', this.$container).data('content-image')) {
                if ($('.l-canvas img:first-child').length) {
                    this.sharingImage = $('.l-canvas img:first-child').attr('src')
                } else {
                    this.sharingImage = ''
                }
                this.setSharingImage()
            }
            if (!this.$container.hasClass('w-sharing-tooltip')) {
                if ($('.whatsapp', this.$container).length && $.isMobile) {
                    this.setWhatsAppUrl(this.$container.find('.whatsapp'))
                }
            } else {
                this.$copy2clipboard = $('.w-sharing-item.copy2clipboard', this.$container);
                this.selectedText = '';
                this.activeArea = '.l-main';
                if (this.$container.data('sharing-area') === 'post_content') {
                    this.activeArea = '.w-post-elm.post_content'
                }
                this.$container.appendTo("body");
                $('body').not(this.activeArea).on('mouseup', function() {
                    var selection = this.getSelection();
                    if (selection === '') {
                        this.$container.hide()
                    }
                }.bind(this));
                $(this.activeArea).on('mouseup', function(e) {
                    var selection = this.getSelection();
                    if (selection !== '') {
                        this.selectedText = selection;
                        this.showTooltip(e)
                    } else {
                        this.selectedText = '';
                        this.hideTooltip()
                    }
                }.bind(this));
                this.$copy2clipboard.on('click', function() {
                    this.copyToClipboard()
                }.bind(this))
            }
        },
        showTooltip: function(e) {
            $('.w-sharing-item', this.$container).each(function(index, elm) {
                if ($(elm).hasClass('copy2clipboard')) {
                    return
                }
                if ($.isMobile && $(elm).hasClass('whatsapp')) {
                    this.setWhatsAppUrl($(elm))
                }
                $(elm).attr('href', ($(elm).data('url') || '').replace('{{text}}', this.selectedText))
            }.bind(this));
            this.$container.css({
                "display": "inline-block",
                "left": e.pageX,
                "top": e.pageY - 50,
            })
        },
        setSharingImage: function() {
            $('.w-sharing-item', this.$container).each(function(index, elm) {
                if ($(elm).hasClass('copy2clipboard')) {
                    return
                }
                $(elm).attr('href', ($(elm).attr('href') || '').replace('{{image}}', this.sharingImage));
                if ($(elm).attr('data-url')) {
                    $(elm).attr('data-url', ($(elm).attr('data-url') || '').replace('{{image}}', this.sharingImage))
                }
            }.bind(this))
        },
        setWhatsAppUrl: function($elm) {
            $elm.attr('href', ($elm.attr('href') || '').replace('https://web', 'https://api'))
        },
        hideTooltip: function() {
            this.$container.hide()
        },
        copyToClipboard: function() {
            var url, el = document.createElement('textarea');
            if (this.$copy2clipboard.parent().data('sharing-url') !== undefined && this.$copy2clipboard.parent().data('sharing-url') !== '') {
                url = this.$copy2clipboard.parent().attr('data-sharing-url')
            } else {
                url = window.location
            }
            el.value = this.selectedText + ' ' + url;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.hideTooltip()
        },
        getSelection: function() {
            var selection = '';
            if (window.getSelection) {
                selection = window.getSelection()
            } else if (document.selection) {
                selection = document.selection.createRange()
            }
            return selection.toString().trim()
        },
    };
    $.fn.UsSharing = function(options) {
        return this.each(function() {
            $(this).data('UsSharing', new $us.UsSharing(this, options))
        })
    };
    $(function() {
        $('.w-sharing-tooltip, .w-sharing').UsSharing()
    })
}(jQuery);
! function($, _undefined) {
    "use strict";
    $us.WTabs = function(container, options) {
        this.init(container, options)
    };
    $us.WTabs.prototype = {
        init: function(container, options) {
            var _defaults = {
                duration: 300,
                easing: 'cubic-bezier(.78,.13,.15,.86)'
            };
            this.options = $.extend({}, _defaults, options);
            this.isRtl = $('.l-body').hasClass('rtl');
            this.$container = $(container);
            this.$tabsList = $('> .w-tabs-list:first', this.$container);
            this.$tabs = $('.w-tabs-item', this.$tabsList);
            this.$sectionsWrapper = $('> .w-tabs-sections:first', this.$container);
            this.$sections = $('> .w-tabs-section', this.$sectionsWrapper);
            this.$headers = this.$sections.children('.w-tabs-section-header');
            this.$contents = this.$sections.children('.w-tabs-section-content');
            this.$tabsBar = $();
            if (this.$container.hasClass('accordion')) {
                this.$tabs = this.$headers
            }
            this.accordionAtWidth = this.$container.data('accordion-at-width');
            this.align = this.$tabsList.usMod('align');
            this.count = this.$tabs.length;
            this.hasScrolling = this.$container.hasClass('has_scrolling') || !1;
            this.isAccordionAtWidth = $ush.parseInt(this.accordionAtWidth) !== 0;
            this.isScrolling = !1;
            this.isTogglable = (this.$container.usMod('type') === 'togglable');
            this.minWidth = 0;
            this.tabHeights = [];
            this.tabLefts = [];
            this.tabTops = [];
            this.tabWidths = [];
            this.width = 0;
            if (this.count === 0) {
                return
            }
            this.basicLayout = this.$container.hasClass('accordion') ? 'accordion' : (this.$container.usMod('layout') || 'hor');
            this.curLayout = this.basicLayout;
            this.active = [];
            this.activeOnInit = [];
            this.definedActive = [];
            this.tabs = $.map(this.$tabs.toArray(), $);
            this.sections = $.map(this.$sections.toArray(), $);
            this.headers = $.map(this.$headers.toArray(), $);
            this.contents = $.map(this.$contents.toArray(), $);
            if (!this.sections.length) {
                return
            }
            $.each(this.tabs, function(index) {
                if (this.sections[index].hasClass('content-empty')) {
                    this.tabs[index].hide();
                    this.sections[index].hide()
                }
                if (this.tabs[index].hasClass('active')) {
                    this.active.push(index);
                    this.activeOnInit.push(index)
                }
                if (this.tabs[index].hasClass('defined-active')) {
                    this.definedActive.push(index)
                }
                this.tabs[index].add(this.headers[index]).on('click mouseover', function(e) {
                    var $link = this.tabs[index];
                    if (!$link.is('a')) {
                        $link = $link.find('a')
                    }
                    if (!$link.length || ($link.is('[href]') && $link.attr('href').indexOf('http') === -1)) {
                        e.preventDefault()
                    }
                    if (e.type == 'mouseover' && (this.$container.hasClass('accordion') || !this.$container.hasClass('switch_hover'))) {
                        return
                    }
                    if (this.curLayout === 'accordion' && this.isTogglable) {
                        this.toggleSection(index)
                    } else {
                        if (index != this.active[0]) {
                            this.headerClicked = !0;
                            this.openSection(index)
                        } else if (this.curLayout === 'accordion') {
                            this.contents[index].css('display', 'block').slideUp(this.options.duration, this._events.contentChanged);
                            this.tabs[index].attr('aria-expanded', 'true').removeClass('active');
                            this.sections[index].removeClass('active');
                            this.active[0] = _undefined
                        }
                    }
                }.bind(this))
            }.bind(this));
            this._events = {
                resize: this.resize.bind(this),
                hashchange: this.hashchange.bind(this),
                contentChanged: function() {
                    $.each(this.tabs, function(_, item) {
                        var $content = $(item);
                        $content.attr('aria-expanded', $content.is('.active'))
                    })
                    $us.$canvas.trigger('contentChange', {
                        elm: this.$container
                    })
                }.bind(this),
                wheel: function() {
                    if (this.isScrolling) {
                        $us.$htmlBody.stop(!0, !1)
                    }
                }
            };
            this.switchLayout(this.curLayout);
            $us.$window.on('resize', $ush.debounce(this._events.resize, 5)).on('hashchange', this._events.hashchange).on('wheel.noPreventDefault', $ush.debounce(this._events.wheel.bind(this), 5));
            $us.$document.ready(function() {
                this.resize();
                $ush.timeout(this._events.resize, 50);
                $ush.timeout(function() {
                    if (window.location.hash) {
                        var hash = window.location.hash.substr(1),
                            $linkedSection = this.$sectionsWrapper.find('.w-tabs-section[id="' + hash + '"]');
                        if ($linkedSection.length && (!$linkedSection.hasClass('active'))) {
                            $linkedSection.find('.w-tabs-section-header').trigger('click')
                        }
                    }
                }.bind(this), 150)
            }.bind(this));
            $.each(this.tabs, function(index) {
                if (this.headers.length && this.headers[index].attr('href') != _undefined) {
                    var tabHref = this.headers[index].attr('href'),
                        tabHeader = this.headers[index];
                    $('a[href="' + tabHref + '"]', this.$container).on('click', function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('w-tabs-section-header', 'w-tabs-item')) {
                            return
                        }
                        if (!$(tabHeader).parent('.w-tabs-section').hasClass('active')) {
                            tabHeader.trigger('click')
                        }
                    })
                }
            }.bind(this));
            this.$container.addClass('initialized');
            this.headerHeight = 0;
            $us.header.on('transitionEnd', function(header) {
                this.headerHeight = header.getCurrentHeight(!0)
            }.bind(this));
            if ($us.usbPreview()) {
                var usbContentChange = function() {
                    if (!this.isTrendy() || this.curLayout == 'accordion') {
                        return
                    }
                    this.measure();
                    this.setBarPosition(this.active[0] || 0)
                }.bind(this);
                this.$container.on('usb.contentChange', $ush.debounce(usbContentChange, 1))
            }
        },
        isTrendy: function() {
            return this.$container.hasClass('style_trendy')
        },
        hashchange: function() {
            if (window.location.hash) {
                var hash = window.location.hash.substr(1),
                    $linkedSection = this.$sectionsWrapper.find('.w-tabs-section[id="' + hash + '"]');
                if ($linkedSection.length && (!$linkedSection.hasClass('active'))) {
                    var $header = $linkedSection.find('.w-tabs-section-header');
                    $header.click()
                }
            }
        },
        switchLayout: function(to) {
            this.cleanUpLayout(this.curLayout);
            this.prepareLayout(to);
            this.curLayout = to
        },
        cleanUpLayout: function(from) {
            this.$sections.resetInlineCSS('display');
            if (from === 'accordion') {
                this.$container.removeClass('accordion');
                this.$contents.resetInlineCSS('height', 'padding-top', 'padding-bottom', 'display', 'opacity')
            }
            if (this.isTrendy() && 'hor|ver'.indexOf(from) > -1) {
                this.$tabsBar.remove()
            }
        },
        prepareLayout: function(to) {
            if (to !== 'accordion' && this.active[0] === _undefined) {
                this.active[0] = this.activeOnInit[0];
                if (this.active[0] !== _undefined) {
                    this.tabs[this.active[0]].addClass('active');
                    this.sections[this.active[0]].addClass('active')
                }
            }
            if (to === 'accordion') {
                this.$container.addClass('accordion');
                this.$contents.hide();
                if (this.curLayout !== 'accordion' && this.active[0] !== _undefined && this.active[0] !== this.definedActive[0]) {
                    this.headers[this.active[0]].removeClass('active');
                    this.tabs[this.active[0]].removeClass('active');
                    this.sections[this.active[0]].removeClass('active');
                    this.active[0] = this.definedActive[0]
                }
                for (var i = 0; i < this.active.length; i++) {
                    if (this.contents[this.active[i]] !== _undefined) {
                        this.tabs[this.active[i]].attr('aria-expanded', 'true').addClass('active');
                        this.sections[this.active[i]].addClass('active');
                        this.contents[this.active[i]].show()
                    }
                }
            } else if (to === 'ver') {
                this.$contents.hide();
                this.contents[this.active[0]].show()
            }
            if (this.isTrendy() && 'hor|ver'.indexOf(this.curLayout) > -1) {
                this.$tabsBar = $('<div class="w-tabs-list-bar"></div>').appendTo(this.$tabsList)
            }
        },
        measure: function() {
            if (this.basicLayout === 'ver') {
                if (this.isAccordionAtWidth) {
                    this.minWidth = this.accordionAtWidth
                } else {
                    var
                        minTabWidth = this.$tabsList.outerWidth(!0),
                        minContentWidth = 300,
                        navWidth = this.$container.usMod('navwidth');
                    if (navWidth !== 'auto') {
                        minTabWidth = Math.max(minTabWidth, minContentWidth * parseInt(navWidth) / (100 - parseInt(navWidth)))
                    }
                    this.minWidth = Math.max(480, minContentWidth + minTabWidth + 1)
                }
                if (this.isTrendy()) {
                    this.tabHeights = [];
                    this.tabTops = [];
                    for (var index = 0; index < this.tabs.length; index++) {
                        this.tabHeights.push(this.tabs[index].outerHeight(!0));
                        this.tabTops.push(index ? (this.tabTops[index - 1] + this.tabHeights[index - 1]) : 0)
                    }
                }
            } else {
                if (this.basicLayout === 'hor') {
                    this.$container.addClass('measure');
                    if (this.isAccordionAtWidth) {
                        this.minWidth = this.accordionAtWidth
                    } else {
                        this.minWidth = 0;
                        for (var index = 0; index < this.tabs.length; index++) {
                            this.minWidth += this.tabs[index].outerWidth(!0)
                        }
                    }
                    this.$container.removeClass('measure')
                }
                if (this.isTrendy()) {
                    this.tabWidths = [];
                    this.tabLefts = [];
                    for (var index = 0; index < this.tabs.length; index++) {
                        this.tabWidths.push(this.tabs[index].outerWidth(!0));
                        this.tabLefts.push(index ? (this.tabLefts[index - 1] + this.tabWidths[index - 1]) : this.tabs[index].position().left)
                    }
                    if (this.isRtl) {
                        var
                            firstTabWidth = this.tabWidths[0],
                            offset = ('none' == this.align) ? this.$tabsList.outerWidth(!0) : this.tabWidths.reduce(function(a, b) {
                                return a + b
                            }, 0);
                        this.tabLefts = this.tabLefts.map(function(left) {
                            return Math.abs(left - offset + firstTabWidth)
                        })
                    }
                }
            }
        },
        setBarPosition: function(index, animated) {
            if (index === _undefined || !this.isTrendy() || 'hor|ver'.indexOf(this.curLayout) == -1) {
                return
            }
            if (!this.$tabsBar.length) {
                this.$tabsBar = $('<div class="w-tabs-list-bar"></div>').appendTo(this.$tabsList)
            }
            var css = {};
            if (this.curLayout === 'hor') {
                css = {
                    width: this.tabWidths[index]
                };
                css[this.isRtl ? 'right' : 'left'] = this.tabLefts[index]
            } else if (this.curLayout === 'ver') {
                css = {
                    top: this.tabTops[index],
                    height: this.tabHeights[index]
                }
            }
            if (!animated) {
                this.$tabsBar.css(css)
            } else {
                this.$tabsBar.performCSSTransition(css, this.options.duration, null, this.options.easing)
            }
        },
        openSection: function(index) {
            if (this.sections[index] === _undefined) {
                return
            }
            if (this.curLayout === 'hor') {
                this.$sections.removeClass('active').css('display', 'none');
                this.sections[index].stop(!0, !0).fadeIn(this.options.duration, function() {
                    $(this).addClass('active')
                })
            } else if (this.curLayout === 'accordion') {
                if (this.contents[this.active[0]] !== _undefined) {
                    this.contents[this.active[0]].css('display', 'block').stop(!0, !1).slideUp(this.options.duration)
                }
                this.contents[index].css('display', 'none').stop(!0, !1).slideDown(this.options.duration, function() {
                    this._events.contentChanged.call(this);
                    if (this.hasScrolling && this.curLayout === 'accordion' && this.headerClicked == !0) {
                        var top = this.headers[index].offset().top;
                        if (!jQuery.isMobile) {
                            top -= $us.$canvas.offset().top || 0
                        }
                        var $prevStickySection = this.$container.closest('.l-section').prevAll('.l-section.type_sticky');
                        if ($prevStickySection.length) {
                            top -= parseInt($prevStickySection.outerHeight(!0))
                        }
                        var animateOptions = {
                            duration: $us.canvasOptions.scrollDuration,
                            easing: $us.getAnimationName('easeInOutExpo'),
                            start: function() {
                                this.isScrolling = !0
                            }.bind(this),
                            always: function() {
                                this.isScrolling = !1
                            }.bind(this),
                            step: function(now, fx) {
                                var newTop = top;
                                if ($us.header.isHorizontal() && $us.header.isStickyEnabled()) {
                                    newTop -= this.headerHeight
                                }
                                if (fx.end !== newTop) {
                                    $us.$htmlBody.stop(!0, !1).animate({
                                        scrollTop: newTop
                                    }, $.extend(animateOptions, {
                                        easing: $us.getAnimationName('easeOutExpo')
                                    }))
                                }
                            }.bind(this)
                        };
                        $us.$htmlBody.stop(!0, !1).animate({
                            scrollTop: top
                        }, animateOptions);
                        this.headerClicked = !1
                    }
                }.bind(this));
                this.$sections.removeClass('active');
                this.sections[index].addClass('active')
            } else if (this.curLayout === 'ver') {
                if (this.contents[this.active[0]] !== _undefined) {
                    this.contents[this.active[0]].css('display', 'none')
                }
                this.contents[index].css('display', 'none').stop(!0, !0).fadeIn(this.options.duration, this._events.contentChanged);
                this.$sections.removeClass('active');
                this.sections[index].addClass('active')
            }
            this._events.contentChanged();
            this.$tabs.attr('aria-expanded', 'false').removeClass('active');
            this.tabs[index].attr('aria-expanded', 'true').addClass('active');
            this.active[0] = index;
            this.setBarPosition(index, !0)
        },
        toggleSection: function(index) {
            var indexPos = $.inArray(index, this.active);
            if (indexPos != -1) {
                this.contents[index].css('display', 'block').slideUp(this.options.duration, this._events.contentChanged);
                this.tabs[index].attr('aria-expanded', 'true').removeClass('active');
                this.sections[index].removeClass('active');
                this.active.splice(indexPos, 1)
            } else {
                this.contents[index].css('display', 'none').slideDown(this.options.duration, this._events.contentChanged);
                this.tabs[index].attr('aria-expanded', 'false').addClass('active');
                this.sections[index].addClass('active');
                this.active.push(index)
            }
        },
        resize: function() {
            this.width = this.isAccordionAtWidth ? $us.$window.outerWidth() : this.$container.width();
            if (this.curLayout !== 'accordion' && !this.width && this.$container.closest('.w-nav').length && !jQuery.isMobile) {
                return
            }
            var nextLayout = (this.width <= this.minWidth) ? 'accordion' : this.basicLayout;
            if (nextLayout !== this.curLayout) {
                this.switchLayout(nextLayout)
            }
            if (this.curLayout !== 'accordion') {
                this.measure()
            }
            this._events.contentChanged();
            this.setBarPosition(this.active[0])
        }
    };
    $.fn.wTabs = function(options) {
        return this.each(function() {
            $(this).data('wTabs', new $us.WTabs(this, options))
        })
    };
    $(() => {
        $('.w-tabs').wTabs()
    });
    $us.$document.on('usPostList.itemsLoaded usGrid.itemsLoaded', (_, $items) => {
        $('.w-tabs', $items).wTabs()
    })
}(jQuery);
jQuery(function($) {
    $('.w-tabs .rev_slider').each(function() {
        var $slider = $(this);
        $slider.bind("revolution.slide.onloaded", function(e) {
            $us.$canvas.on('contentChange', function() {
                $slider.revredraw()
            })
        })
    })
});
(function($, _undefined) {
    "use strict";
    window.$us.YTPlayers = window.$us.YTPlayers || {};
    $us.wVideo = function(container) {
        const self = this;
        self.$container = $(container);
        self.$videoH = $('.w-video-h', self.$container);
        self.cookieName = self.$container.data('cookie-name');
        self.isWithOverlay = self.$container.hasClass('with_overlay');
        if ($ush.isSafari) {
            (self.getVideoElement() || {
                load: $.noop
            }).load()
        }
        if (!self.cookieName && !self.isWithOverlay) {
            return
        }
        self.data = {};
        if (self.$container.is('[onclick]')) {
            self.data = self.$container[0].onclick() || {};
            if (!$us.usbPreview()) self.$container.removeAttr('onclick')
        }
        self._events = {
            hideOverlay: self._hideOverlay.bind(self),
            confirm: self._confirm.bind(self)
        };
        if (self.cookieName) {
            self.$container.on('click', '.action_confirm_load', self._events.confirm)
        }
        self.$container.one('click', '> *', self._events.hideOverlay)
    };
    $.extend($us.wVideo.prototype, {
        getVideoElement: function() {
            return $('video', this.$videoH)[0] || null
        },
        _confirm: function() {
            const self = this;
            if ($('input[name^=' + self.cookieName + ']:checked', self.$container).length) {
                $ush.setCookie(self.cookieName, 1, 365)
            }
            if (self.isWithOverlay) {
                self.insertPlayer()
            } else {
                self.$videoH.html($ush.base64Decode('' + $('script[type="text/template"]', self.$container).text())).removeAttr('data-cookie-name')
            }
        },
        _hideOverlay: function(e) {
            const self = this;
            e.preventDefault();
            if (self.$container.is('.with_overlay')) {
                self.$container.removeAttr('style').removeClass('with_overlay')
            }
            if (!self.cookieName) {
                self.insertPlayer()
            }
        },
        insertPlayer: function() {
            const self = this;
            var data = $.extend({
                player_id: '',
                player_api: '',
                player_html: ''
            }, self.data || {});
            if (data.player_api && !$('script[src="' + data.player_api + '"]', document.head).length) {
                $('head').append('<script src="' + data.player_api + '"></script>')
            }
            self.$videoH.html(data.player_html);
            const videoElement = self.getVideoElement();
            if (!data.player_api && $ush.isNode(videoElement)) {
                if (self.isWithOverlay && $ush.isSafari) {
                    videoElement.setAttribute('preload', 'metadata')
                }
                videoElement.play()
            }
        }
    });
    $.fn.wVideo = function() {
        return this.each(function() {
            $(this).data('wVideo', new $us.wVideo(this))
        })
    };
    $(() => $('.w-video').wVideo());
    $us.$document.on('usPostList.itemsLoaded usGrid.itemsLoaded', (_, $items) => {
        $('.w-video', $items).wVideo()
    })
})(jQuery);
(function($) {
    var $window = $(window),
        windowHeight = $window.height();
    $.fn.parallax = function(xposParam) {
        this.each(function() {
            var $container = $(this),
                $this = $container.children('.l-section-img'),
                speedFactor, offsetFactor = 0,
                getHeight, topOffset = 0,
                containerHeight = 0,
                containerWidth = 0,
                disableParallax = !1,
                parallaxIsDisabled = !1,
                baseImgHeight = 0,
                baseImgWidth = 0,
                isBgCover = ($this.css('background-size') == 'cover'),
                originalBgPos = $this.css('background-position'),
                curImgHeight = 0,
                reversed = $container.hasClass('parallaxdir_reversed'),
                baseSpeedFactor = reversed ? -0.1 : 0.61,
                xpos, outerHeight = !0;
            if ($this.length == 0) {
                return
            }
            if (xposParam === undefined) {
                xpos = "50%"
            } else {
                xpos = xposParam
            }
            if ($container.hasClass('parallax_xpos_right')) {
                xpos = "100%"
            } else if ($container.hasClass('parallax_xpos_left')) {
                xpos = "0%"
            }
            if (outerHeight) {
                getHeight = function(jqo) {
                    return jqo.outerHeight(!0)
                }
            } else {
                getHeight = function(jqo) {
                    return jqo.height()
                }
            }

            function getBackgroundSize(callback) {
                var img = new Image(),
                    width, height, backgroundSize = ($this.css('background-size') || ' ').split(' '),
                    backgroundWidthAttr = $this.attr('data-img-width'),
                    backgroundHeightAttr = $this.attr('data-img-height');
                if (backgroundWidthAttr != '') {
                    width = parseInt(backgroundWidthAttr)
                }
                if (backgroundHeightAttr != '') {
                    height = parseInt(backgroundHeightAttr)
                }
                if (width !== undefined && height !== undefined) {
                    return callback({
                        width: width,
                        height: height
                    })
                }
                if (/px/.test(backgroundSize[0])) {
                    width = parseInt(backgroundSize[0])
                }
                if (/%/.test(backgroundSize[0])) {
                    width = $this.parent().width() * (parseInt(backgroundSize[0]) / 100)
                }
                if (/px/.test(backgroundSize[1])) {
                    height = parseInt(backgroundSize[1])
                }
                if (/%/.test(backgroundSize[1])) {
                    height = $this.parent().height() * (parseInt(backgroundSize[0]) / 100)
                }
                if (width !== undefined && height !== undefined) {
                    return callback({
                        width: width,
                        height: height
                    })
                }
                img.onload = function() {
                    if (typeof width == 'undefined') {
                        width = this.width
                    }
                    if (typeof height == 'undefined') {
                        height = this.height
                    }
                    callback({
                        width: width,
                        height: height
                    })
                };
                img.src = ($this.css('background-image') || '').replace(/url\(['"]*(.*?)['"]*\)/g, '$1')
            }

            function update() {
                if ($us.$html.hasClass('ios-touch')) {
                    return
                }
                if (disableParallax) {
                    if (!parallaxIsDisabled) {
                        $this.css('backgroundPosition', originalBgPos);
                        $container.usMod('parallax', 'fixed');
                        parallaxIsDisabled = !0
                    }
                    return
                } else {
                    if (parallaxIsDisabled) {
                        $container.usMod('parallax', 'ver');
                        parallaxIsDisabled = !1
                    }
                }
                if (isNaN(speedFactor)) {
                    return
                }
                var pos = $window.scrollTop();
                if ((topOffset + containerHeight < pos) || (pos < topOffset - windowHeight)) {
                    return
                }
                $this.css('backgroundPosition', xpos + " " + (offsetFactor + speedFactor * (topOffset - pos)) + "px")
            }

            function resize() {
                $ush.timeout(function() {
                    windowHeight = $window.height();
                    containerHeight = getHeight($this);
                    containerWidth = $this.width();
                    if ($window.width() < $us.canvasOptions.disableEffectsWidth) {
                        disableParallax = !0
                    } else {
                        disableParallax = !1;
                        if (isBgCover) {
                            if (baseImgWidth / baseImgHeight <= containerWidth / containerHeight) {
                                curImgHeight = baseImgHeight * ($this.width() / baseImgWidth);
                                disableParallax = !1
                            } else {
                                disableParallax = !0
                            }
                        }
                    }
                    if (curImgHeight !== 0) {
                        if (baseSpeedFactor >= 0) {
                            speedFactor = Math.min(baseSpeedFactor, curImgHeight / windowHeight);
                            offsetFactor = .5 * (windowHeight - curImgHeight - speedFactor * (windowHeight - containerHeight));
                            if (offsetFactor > 0) {
                                offsetFactor = -offsetFactor
                            }
                        } else {
                            speedFactor = Math.min(baseSpeedFactor, (windowHeight - containerHeight) / (windowHeight + containerHeight));
                            offsetFactor = Math.max(0, speedFactor * containerHeight)
                        }
                    } else {
                        speedFactor = baseSpeedFactor;
                        offsetFactor = 0
                    }
                    topOffset = $this.offset().top;
                    update()
                }, 10)
            }
            getBackgroundSize(function(sz) {
                curImgHeight = baseImgHeight = sz.height;
                baseImgWidth = sz.width;
                resize()
            });
            $window.bind({
                'scroll.noPreventDefault': update,
                load: resize,
                resize: resize
            });
            resize()
        })
    };
    jQuery('.parallax_ver').parallax('50%')
})(jQuery);