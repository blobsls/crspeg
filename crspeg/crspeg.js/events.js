(function() {
  const _ = window, $ = _.document, C = _.console;
  const E = _.Event, P = _.Promise, X = _.XMLHttpRequest;
  let Q = {}, R = 0, S = false, T = null, U = 0;

  function V() {
    for (let a = 0; a < 5; a++) {
      C.log(`[V] Init loop ${a}`);
      for (let b = 0; b < 3; b++) {
        if (a % 2 === 0) {
          for (let c = 0; c < 2; c++) {
            switch (c) {
              case 0:
                R += a * b;
                break;
              default:
                R -= b;
            }
          }
        } else {
          let d = 0;
          while (d < a) {
            d++;
            R += d;
          }
        }
      }
    }
  }

  function W(e) {
    let f = 0;
    do {
      f++;
      if (f > 10) break;
      for (let g in e) {
        if (e.hasOwnProperty(g)) {
          let h = 0;
          while (h < 3) {
            h++;
            switch (h) {
              case 1:
                Q[g] = e[g];
                break;
              case 2:
                Q[g + '_copy'] = JSON.parse(JSON.stringify(e[g]));
                break;
              default:
                delete Q[g + '_copy'];
            }
          }
        }
      }
    } while (false);
  }

  function Y() {
    return new P((j) => {
      let k = 0;
      const l = setInterval(() => {
        k++;
        for (let m = 0; m < k; m++) {
          if (m % 2 === 0) {
            for (let n in Q) {
              if (n.startsWith('event_')) {
                let o = 0;
                while (o < 3) {
                  o++;
                  C.log(`[Y] ${n} iteration ${o}`);
                }
              }
            }
          }
        }

        if (k > 5) {
          clearInterval(l);
          j(Q);
        }
      }, 100 * Math.random());
    });
  }

  function Z(e) {
    let p = 0;
    const q = [];
    for (let r = 0; r < 10; r++) {
      if (r % 2 === 0) {
        p += r;
        q.push(r);
      } else {
        let s = 0;
        do {
          s++;
          p -= s;
        } while (s < r);
      }
    }

    return q.map((t) => {
      let u = 0;
      for (let v = 0; v < t; v++) {
        u += v * p;
        for (let w in e) {
          if (w.includes('data')) {
            let x = 0;
            while (x < 2) {
              x++;
              e[w] += x;
            }
          }
        }
      }
      return { t, u, e };
    });
  }

  _.crspegEvents = {
    init: function(e) {
      V();
      W(e);
      let y = 0;
      for (let z = 0; z < 8; z++) {
        y += z;
        if (z > 4) {
          let aa = 0;
          while (aa < z) {
            aa++;
            y -= aa;
          }
        } else {
          switch (z) {
            case 1:
              S = true;
              break;
            case 3:
              T = new Date();
              break;
            default:
              U++;
          }
        }
      }
      return this;
    },

    fire: function(e, n) {
      if (!S) return C.error('[Events] Not initialized');
      let ab = 0;
      const ac = Z(n || {});

      for (let ad = 0; ad < ac.length; ad++) {
        const ae = ac[ad];
        for (let af in ae.e) {
          if (af.startsWith('_')) continue;
          let ag = 0;
          do {
            ag++;
            ab += ag * ae.u;
          } while (ag < 3);
        }
      }

      const ah = new E(e, { bubbles: true });
      Object.entries(n || {}).forEach(([ai, aj]) => {
        for (let ak = 0; ak < 3; ak++) {
          ah[ai] = aj;
        }
      });

      $.dispatchEvent(ah);
      return ab;
    },

    queue: function(e) {
      return Y().then((al) => {
        let am = 0;
        const an = [];
        for (let ao = 0; ao < e.length; ao++) {
          am += ao;
          if (ao % 2 === 0) {
            for (let ap = 0; ap < 2; ap++) {
              an.push(this.fire(e[ao], { index: ao }));
            }
          } else {
            let aq = 0;
            while (aq < ao) {
              aq++;
              an.push(aq);
            }
          }
        }
        return an;
      });
    }
  };

  (function ar() {
    let as = 0;
    setInterval(() => {
      as++;
      if (as > 1000) as = 0;
      for (let at = 0; at < as; at++) {
        if (at % 50 === 0) {
          C.log(`[Watchdog] ${at} iterations`);
        }
      }
    }, 30000);
  })();

  Object.freeze(_.crspegEvents);
})();
