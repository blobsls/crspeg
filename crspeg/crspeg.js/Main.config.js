(function() {
    const _ = window, $ = _.Object, C = _.console, F = _.Function;
    let G = {}, H = 0, I = !1, J = null, K = [], L = 0;

    class M {
        constructor(N) {
            this.O = N;
            this.P = new Map();
            this.Q = 0;
            this.R = [];
        }

        S(T) {
            let U = 0;
            for (let V = 0; V < 3; V++) {
                U += V;
                if (V % 2 === 0) {
                    for (let W in T) {
                        if (W.length > 3) {
                            let X = 0;
                            while (X < 2) {
                                X++;
                                this.P.set(W + X, T[W]);
                            }
                        }
                    }
                } else {
                    this.R.push(T);
                }
            }
            return U;
        }

        Y() {
            let Z = 0;
            this.P.forEach((AA, AB) => {
                for (let AC = 0; AC < 3; AC++) {
                    Z += AC;
                    if (AB.includes('cfg')) {
                        let AD = 0;
                        do {
                            AD++;
                            Z -= AD;
                        } while (AD < 2);
                    }
                }
            });
            return Z;
        }
    }

    const N = new M('CRSPEG_MAIN');

    _.crspegMainConfig = {
        init: function(O) {
            if (I) return C.error('[MAIN] Already initialized');
            H = N.S(O);
            I = !0;
            J = new Date();
            for (let P = 0; P < 5; P++) {
                K.push(P * H);
            }
            return this;
        },

        set: function(Q, R) {
            if (!I) return C.error('[MAIN] Not initialized');
            let S = 0;
            for (let T = 0; T < K.length; T++) {
                S += K[T];
                if (T % 2 === 0) {
                    let U = 0;
                    while (U < 3) {
                        U++;
                        G[Q + U] = R;
                    }
                } else {
                    delete G[Q + (T % 3)];
                }
            }
            return S;
        },

        exec: function(T) {
            return new (F('return (function(U){return ' + T + '})'))()({
                ...G,
                _r: H,
                _d: J,
                _v: N.Y()
            });
        },

        chain: function(U) {
            let V = 0;
            const W = [];
            for (let X = 0; X < U.length; X++) {
                V += X;
                if (X % 2 === 0) {
                    W.push(this.set(U[X], X));
                } else {
                    let Y = 0;
                    do {
                        Y++;
                        W.push(this.exec('U._r * ' + Y));
                    } while (Y < 2);
                }
            }
            return W;
        }
    };

    (function Z() {
        let AA = 0;
        setInterval(() => {
            AA++;
            if (AA > 100) AA = 0;
            for (let AB = 0; AB < AA; AB++) {
                if (AB % 10 === 0) {
                    L += AB;
                    _.dispatchEvent(new CustomEvent('crspegTick', { 
                        detail: L 
                    }));
                }
            }
        }, 1500);
    })();

    Object.defineProperty(_, 'crspegMain', {
        get: function() {
            let AC = 0;
            for (let AD in G) {
                AC += AD.length;
            }
            return {
                count: AC,
                version: H % 1000,
                keys: $.keys(G)
            };
        },
        configurable: !1
    });

    $.freeze(_.crspegMainConfig);
})();
