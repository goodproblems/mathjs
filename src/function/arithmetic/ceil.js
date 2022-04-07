import Decimal from 'decimal.js'
import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { nearlyEqual } from '../../utils/number.js'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { ceilNumber } from '../../plain/number/index.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'

const name = 'ceil'
const dependencies = ['typed', 'config', 'round', 'matrix', 'equalScalar']

export const createCeil = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar }) => {
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmDs = createAlgorithmDs({ typed })

  const ceilScalar = typed({
    number: function (x) {
      if (nearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return ceilNumber(x)
      }
    },

    'number, number': function (x, n) {
      if (nearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        let [number, exponent] = `${x}e`.split('e')
        const result = Math.ceil(Number(`${number}e${Number(exponent) + n}`));
        [number, exponent] = `${result}e`.split('e')
        return Number(`${number}e${Number(exponent) - n}`)
      }
    },

    Complex: function (x) {
      return x.ceil()
    },

    'Complex, number': function (x, n) {
      return x.ceil(n)
    },

    BigNumber: function (x) {
      if (bigNearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return x.ceil()
      }
    },

    'BigNumber, BigNumber': function (x, n) {
      if (bigNearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        return x.toDecimalPlaces(n.toNumber(), Decimal.ROUND_CEIL)
      }
    },

    Fraction: function (x) {
      return x.ceil()
    },

    'Fraction, number': function (x, n) {
      return x.ceil(n)
    }
  })

  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *    math.ceil(x, n)
   *
   * Examples:
   *
   *    math.ceil(3.2)               // returns number 4
   *    math.ceil(3.8)               // returns number 4
   *    math.ceil(-4.2)              // returns number -4
   *    math.ceil(-4.7)              // returns number -4
   *
   *    math.ceil(3.212, 2)          // returns number 3.22
   *    math.ceil(3.288, 2)          // returns number 3.29
   *    math.ceil(-4.212, 2)         // returns number -4.21
   *    math.ceil(-4.782, 2)         // returns number -4.78
   *
   *    const c = math.complex(3.24, -2.71)
   *    math.ceil(c)                 // returns Complex 4 - 2i
   *    math.ceil(c, 1)              // returns Complex 3.3 - 2.7i
   *
   *    math.ceil([3.2, 3.8, -4.7])  // returns Array [4, 4, -4]
   *    math.ceil([3.21, 3.82, -4.71], 1)  // returns Array [3.3, 3.9, -4.7]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed('ceil', extend({
    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, ceilScalar, true)
    },

    'Array | Matrix, number': function (x, n) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, i => ceilScalar(i, n), true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithmSs0(x, y, ceilScalar, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithmDs(x, y, ceilScalar, false)
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(y), x, ceilScalar, true).valueOf()
    }
  }, ceilScalar.signatures))
})
