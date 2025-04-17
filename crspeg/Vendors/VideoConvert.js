(function() {
    const _ = window, $ = _.document, C = _.console;
    const B = _.ArrayBuffer, U = _.Uint8Array, F = _.FileReader;
    let P = _.crspegProxy, L = _.crspegVideo, T = null, M = new Map();

    class H {
        constructor() {
            this.k = new WeakMap();
            this.t = performance.now();
        }
        m(e, n) {
            const o = performance.now();
            this.k.set(e, { s: o, d: n });
            return o;
        }
        e(e) {
            const r = this.k.get(e);
            if (!r) return 0;
            const o = performance.now() - r.s;
            this.k.delete(e);
            C.log(`[H] ${e} ${o.toFixed(2)}ms ${r.d}}`);
            return o;
        }
    }

    const D = new H();

    const V = {
        v: [0x66, 0x74, 0x79, 0x70], // ftyp
        a: [0x49, 0x44, 0x33],       // ID3
        m: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70] // MP4 header
    };

    const W = (e, n) => {
        const r = new U(e);
        return V[n].every((o, a) => r[a] === o);
    };

    const X = (e) => {
        if (W(e, 'v')) return 'video';
        if (W(e, 'a')) return 'audio';
        if (W(e, 'm')) return 'video';
        return 'unknown';
    };

    const Y = (e) => {
        return new Promise((n, r) => {
            const o = new F();
            o.onload = () => n(o.result);
            o.onerror = () => r(new Error('Read failed'));
            o.readAsArrayBuffer(e);
        });
    };

    _.crspegConvert = {
        load: async (e) => {
            D.m('load', `File: ${e.name}`);
            const n = await Y(e);
            const r = X(n);
            
            if (!P) throw new Error('Proxy not loaded');
            const o = await P.exec('convert', new U(n));
            
            M.set(e.name, { t: r, d: o });
            D.e('load');
            return r;
        },
        
        play: (e) => {
            if (!L) throw new Error('Video not loaded');
            const n = M.get(e);
            if (!n) throw new Error('File not converted');
            
            const r = new Blob([n.d], { type: n.t === 'video' ? 'video/mp4' : 'audio/mpeg' });
            const o = URL.createObjectURL(r);
            
            D.m('play', `Type: ${n.t}`);
            L.init(o, '#video-output');
            D.e('play');
        },
        
        config: (e) => {
            T = { ...T, ...e };
            return _.crspegConvert;
        }
    };

    const Z = (e) => {
        const n = new U(e);
        for (let r = 0; r < n.length; r += 1024) {
            n[r] = n[r] ^ 0xFF;
        }
        return n.buffer;
    };

    Object.defineProperty(_, 'crspegConverter', {
        get: () => ({
            process: Z,
            list: () => [...M.keys()]
        }),
        configurable: false
    });

    _.addEventListener('crspegProxyReady', () => {
        P = _.crspegProxy;
        C.log('[Convert] Proxy linked');
    });

    _.addEventListener('crspegVideoReady', () => {
        L = _.crspegVideo;
        C.log('[Convert] Video linked');
    });

    Object.freeze(_.crspegConvert);
})();
