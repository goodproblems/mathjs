import Decimal from 'decimal.js'
import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { nearlyEqual } from '../../utils/number.js'
import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'

const name = 'floor'
const dependencies = ['typed', 'config', 'round', 'matrix', 'equalScalar']

export const createFloor = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, round, matrix, equalScalar }) => {
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmDs = createAlgorithmDs({ typed })

  const floorScalar = typed({
    number: function (x) {
      if (nearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return Math.floor(x)
      }
    },

    'number, number': function (x, n) {
      if (nearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        let [number, exponent] = `${x}e`.split('e')
        const result = Math.floor(Number(`${number}e${Number(exponent) + n}`));
        [number, exponent] = `${result}e`.split('e')
        return Number(`${number}e${Number(exponent) - n}`)
      }
    },

    Complex: function (x) {
      return x.floor()
    },

    'Complex, number': function (x, n) {
      return x.floor(n)
    },

    BigNumber: function (x) {
      if (bigNearlyEqual(x, round(x), config.epsilon)) {
        return round(x)
      } else {
        return x.floor()
      }
    },

    'BigNumber, BigNumber': function (x, n) {
      if (bigNearlyEqual(x, round(x, n), config.epsilon)) {
        return round(x, n)
      } else {
        return x.toDecimalPlaces(n.toNumber(), Decimal.ROUND_FLOOR)
      }
    },

    Fraction: function (x) {
      return x.floor()
    },

    'Fraction, number': function (x, n) {
      return x.floor(n)
    }
  })

  /**
   * Round a value towards minus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.floor(x)
   *    math.floor(x, n)
   *
   * Examples:
   *
   *    math.floor(3.2)              // returns number 3
   *    math.floor(3.8)              // returns number 3
   *    math.floor(-4.2)             // returns number -5
   *    math.floor(-4.7)             // returns number -5
   *
   *    math.floor(3.212, 2)          // returns number 3.21
   *    math.floor(3.288, 2)          // returns number 3.28
   *    math.floor(-4.212, 2)         // returns number -4.22
   *    math.floor(-4.782, 2)         // returns number -4.79
   *
   *    const c = math.complex(3.24, -2.71)
   *    math.floor(c)                 // returns Complex 3 - 3i
   *    math.floor(c, 1)              // returns Complex 3.2 - 2.8i
   *
   *    math.floor([3.2, 3.8, -4.7])       // returns Array [3, 3, -5]
   *    math.floor([3.21, 3.82, -4.71], 1)  // returns Array [3.2, 3.8, -4.8]
   *
   * See also:
   *
   *    ceil, fix, round
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed('floor', floorScalar, {
    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since floor(0) = 0
      return deepMap(x, floorScalar, true)
    },

    'Array | Matrix, number': function (x, n) {
      // deep map collection, skip zeros since ceil(0) = 0
      return deepMap(x, i => floorScalar(i, n), true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithmSs0(x, y, floorScalar, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithmDs(x, y, floorScalar, false)
    },

    'number | Complex | BigNumber | Fraction, Array': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(y), x, floorScalar, true).valueOf()
    }
  })
})
