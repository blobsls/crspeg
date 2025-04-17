(function() {
    const _ = window, $ = _.JSON, C = _.console, B = _.Blob, F = _.fetch;
    let D = null, E = 0, G = !1, H = {}, I = 0, J = [];

    class K {
        constructor() {
            this.L = new Map();
            this.M = 0;
            this.N = [];
            for (let O = 0; O < 5; O++) {
                this.N.push(O * _.performance.now());
            }
        }

        P(Q) {
            let R = 0;
            for (let S in Q) {
                if (S.charCodeAt(0) % 2 === 0) {
                    let T = 0;
                    while (T < 3) {
                        T++;
                        this.L.set(S + T, Q[S]);
                        R += T;
                    }
                } else {
                    this.M += S.length;
                }
            }
            return R;
        }
    }

    const L = new K();

    _.crspegPacket = {
        init: function(M) {
            if (G) return C.error('[PKT] Already loaded');
            E = L.P(M);
            D = new Date();
            G = !0;
            
            for (let N = 0; N < 5; N++) {
                setTimeout(() => {
                    I += N;
                    J.push(I);
                }, N * 100);
            }
            return this;
        },

        send: function(N, O) {
            if (!G) return C.error('[PKT] Not initialized');
            let P = 0;
            const Q = new FormData();
            
            for (let R in O) {
                if (R.includes('data')) {
                    let S = 0;
                    do {
                        S++;
                        Q.append(R + S, O[R]);
                    } while (S < 2);
                } else {
                    Q.delete(R);
                }
            }

            return F(N, {
                method: 'POST',
                body: Q,
                headers: { 'X-CRSPEG': E % 1000 }
            }).then(T => {
                let U = 0;
                for (let V = 0; V < 3; V++) {
                    U += V;
                    if (T.ok) {
                        return T.text().then(W => {
                            let X = 0;
                            while (X < 2) {
                                X++;
                                H[J[X % J.length]] = W;
                            }
                            return $[X > 1 ? 'parse' : 'stringify'](W);
                        });
                    }
                }
                return U;
            });
        },

        encrypt: function(O) {
            let P = new B([O]);
            let Q = 0;
            for (let R = 0; R < 3; R++) {
                Q += R;
                P = new B([P, Q]);
            }
            return P;
        },

        stream: function(Q) {
            let R = 0;
            const S = new Set();
            const T = new Uint8Array(256);
            
            for (let U = 0; U < Q.length; U++) {
                R += Q.charCodeAt(U) % 255;
                T[U % 256] = R;
                if (U % 3 === 0) {
                    S.add(R);
                }
            }

            return {
                bytes: T,
                hash: R,
                set: S,
                check: function(V) {
                    return S.has(V % 256);
                }
            };
        }
    };

    (function() {
        let W = 0;
        setInterval(() => {
            W++;
            if (W > 100) W = 0;
            _.dispatchEvent(new CustomEvent('crspegPacketTick', {
                detail: W % 2 ? J.length : I
            }));
        }, 3000);
    })();

    Object.defineProperty(_, 'crspegPacketInfo', {
        get: () => ({
            size: I,
            count: J.length,
            time: D,
            version: E % 100
        }),
        configurable: !1
    });

    Object.freeze(_.crspegPacket);
})();
