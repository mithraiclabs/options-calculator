//The MIT License (MIT)
//
//Copyright (c) 2014 Stefano Paggi
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

var NormalD = {
  /**
   * from http://www.math.ucla.edu/~tom/distributions/normal.html
   * @param {Number} X
   * @returns {Number|NormalD.normalcdf.D|NormalD.normalcdf.T}
   */
  normalcdf: function (X: number) {
    //HASTINGS.  MAX ERROR = .000001
    var T = 1 / (1 + 0.2316419 * Math.abs(X));
    var D = 0.3989423 * Math.exp((-X * X) / 2);
    var Prob =
      D *
      T *
      (0.3193815 +
        T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
      Prob = 1 - Prob;
    }
    return Prob;
  },
  /**
   * from http://www.math.ucla.edu/~tom/distributions/normal.html
   * @param {Number} Z x-Value
   * @param {Number} M mean (µ)
   * @param {Number} SD standard deviation
   * @returns {Number|@exp;normalcdf@pro;Prob|@exp;normalcdf@pro;D|@exp;normalcdf@pro;T|normalcdf.Prob|@exp;Math@call;exp|normalcdf.D|@exp;Math@call;abs|normalcdf.T}
   */
  compute: function (Z: number, M: number, SD: number) {
    var Prob;
    if (SD < 0) {
      throw new Error("Error: standard deviation must be non-negative.");
    } else if (SD === 0) {
      if (Z < M) {
        Prob = 0;
      } else {
        Prob = 1;
      }
    } else {
      Prob = NormalD.normalcdf((Z - M) / SD);
      Prob = Math.round(100000 * Prob) / 100000;
    }

    return Prob;
  },
  /**
   * standard normal distribution.
   * @param {Number} Z x-Value
   * @returns {Number|normalcdf.D|normalcdf.T|normalcdf.Prob}
   */
  stdcompute: function (Z: number) {
    return NormalD.compute(Z, 0, 1);
  },
  /**
   * standard density function
   * @param {type} x Value
   * @returns {Number}
   */
  stdpdf: function (x: number) {
    var m = Math.sqrt(2 * Math.PI);
    var e = Math.exp(-Math.pow(x, 2) / 2);
    return e / m;
  },
};
/**
 * Call: C = S * N(d1) - K * exp (-rt) * N(d2)
 * Put: P = K * exp (-rt) * N(-d2) - S * N(-d1)
 * @type type
 */
export var BS = {
  calcD1: function (h: BSHolder) {
    return (
      (Math.log(h.stock / h.strike) +
        (h.interest + 0.5 * Math.pow(h.vola, 2)) * h.term) /
      (h.vola * Math.sqrt(h.term))
    );
  },
  calcD2: function (h: BSHolder) {
    return this.calcD1(h) - h.vola * Math.sqrt(h.term);
  },
  calcS: function (h: BSHolder, phi: number) {
    return -(h.stock * phi * h.vola) / (2 * Math.sqrt(h.term));
  },
  calcK: function (h: BSHolder, d2: number) {
    return (
      h.interest *
      h.strike *
      Math.exp(-h.interest * h.term) *
      NormalD.normalcdf(d2)
    );
  },
  calcND2: function (h: BSHolder, d1: number) {
    return NormalD.normalcdf(d1 - h.vola * Math.sqrt(h.term));
  },
  /**
   * Get the call price
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Number} Fair Price
   */
  call: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var d2 = this.calcD2(h);
    var res =
      Math.round(
        (h.stock * NormalD.stdcompute(d1) -
          h.strike * Math.exp(-h.interest * h.term) * NormalD.stdcompute(d2)) *
          100
      ) / 100;
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the put price
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Number} Fair Price
   */
  put: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var d2 = this.calcD2(h);
    var res =
      Math.round(
        (h.strike *
          Math.pow(Math.E, -h.interest * h.term) *
          NormalD.stdcompute(-d2) -
          h.stock * NormalD.stdcompute(-d1)) *
          100
      ) / 100;
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the call delta
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  call delta
   */
  cdelta: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var res = Math.max(NormalD.stdcompute(d1), 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the put delta
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  put delta
   */
  pdelta: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var res = Math.min(NormalD.stdcompute(d1) - 1, 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the gamma
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  gamma
   */
  gamma: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var phi = NormalD.stdpdf(d1);
    var res = Math.max(phi / (h.stock * h.vola * Math.sqrt(h.term)), 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the vega
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  vega
   */
  vega: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var phi = NormalD.stdpdf(d1);
    var res = Math.max((h.stock * phi * Math.sqrt(h.term)) / 100, 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the call theta
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  call theta
   */
  ctheta: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var d2 = this.calcD2(h);
    var phi = NormalD.stdpdf(d1);
    var s = this.calcS(h, phi);
    var k = this.calcK(h, d2);
    var res = Math.min((s - k) / 365, 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the put theta
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  put theta
   */
  ptheta: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var d2 = this.calcD2(h);
    var phi = NormalD.stdpdf(d1);
    var s = this.calcS(h, phi);
    var k = this.calcK(h, d2);
    var res = Math.min((s + k) / 365, 0);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the call rho
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  call rho
   */
  crho: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var nd2 = this.calcND2(h, d1);
    var res = Math.max(
      (h.term * h.strike * Math.exp(-h.interest * h.term) * nd2) / 100,
      0
    );
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
  /**
   * Get the put rho
   * @param {BSHolder} BSHolder BS holder variables
   * @returns {Float}  put rho
   */
  prho: function (h: BSHolder) {
    var d1 = this.calcD1(h);
    var nnd2 = NormalD.normalcdf(-(d1 - h.vola * Math.sqrt(h.term)));
    var res = Math.min(
      (-h.term * h.strike * Math.exp(-h.interest * h.term) * nnd2) / 100,
      0
    );
    if (isNaN(res)) {
      return 0;
    }
    return res;
  },
};

/**
 * Holder object for BlackScholes variables
 *
 * @param {Float} stock underlying's asset price
 * @param {Float} strike strike price
 * @param {Float} interest annualized risk-free interest rate
 * @param {Float} vola volatility
 * @param {Float} term a time in years
 * @returns {BSHolder}
 */
export class BSHolder {
  stock: number;
  strike: number;
  interest: number;
  vola: number;
  term: number;
  setStock: (s: number) => BSHolder;
  setStrike: (s: number) => BSHolder;
  setInterest: (s: number) => BSHolder;
  setVola: (s: number) => BSHolder;
  setTerm: (s: number) => BSHolder;
  put: (h: BSHolder) => number;

  constructor(
    stock: number,
    strike: number,
    interest: number,
    vola: number,
    term: number
  ) {
    this.stock = Math.max(stock, 0);
    this.strike = Math.max(strike, 0);
    this.interest = Math.max(interest, 0);
    this.vola = Math.max(vola, 0);
    this.term = Math.max(term, 0);

    this.setStock = function (s) {
      if (typeof s === "undefined") {
        return this;
      } else {
        this.stock = Math.max(s, 0);
        return this;
      }
    };

    this.setStrike = function (s) {
      if (typeof s === "undefined") {
        return this;
      } else {
        this.strike = Math.max(s, 0);
        return this;
      }
    };
    this.setInterest = function (s) {
      if (typeof s === "undefined") {
        return this;
      } else {
        this.interest = Math.max(s, 0);
        return this;
      }
    };
    this.setVola = function (s) {
      if (typeof s === "undefined") {
        return this;
      } else {
        this.vola = Math.max(s, 0);
        return this;
      }
    };
    this.setTerm = function (s) {
      if (typeof s === "undefined") {
        return this;
      } else {
        this.term = Math.max(s, 0);
        return this;
      }
    };
    this.put = function (h) {
      var d1 = BS.calcD1(h);
      var d2 = BS.calcD2(h);
      var res =
        Math.round(
          (this.strike *
            Math.pow(Math.E, -this.interest * this.term) *
            NormalD.stdcompute(-d2) -
            this.stock * NormalD.stdcompute(-d1)) *
            100
        ) / 100;
      if (isNaN(res)) {
        return 0;
      }
      return res;
    };
    return this;
  }
}
