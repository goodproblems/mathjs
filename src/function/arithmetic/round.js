import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { isInteger } from '../../utils/number.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'
import { roundNumber } from '../../plain/number/index.js'

const NO_INT = 'Number of decimals in function round must be an integer'

const name = 'round'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'BigNumber',
  'DenseMatrix'
]

const roundNumberSignatures = {
  number: roundNumber,

  'number, number': function (x, n) {
    if (!isInteger(n)) { throw new TypeError(NO_INT) }
    if (n < 0 || n > 15) { throw new Error('Number of decimals in function round must be in the range of 0-15') }

    return roundNumber(x, n)
  }
}

export const createRound = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, BigNumber, DenseMatrix }) => {
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const algorithmDs = createAlgorithmDs({ typed })

  const roundScalar = typed(extend({
    Complex: function (x) {
      return x.round()
    },

    'Complex, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }

      return x.round(n)
    },

    'Complex, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      const _n = n.toNumber()
      return x.round(_n)
    },

    'number, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return new BigNumber(x).toDecimalPlaces(n.toNumber())
    },

    BigNumber: function (x) {
      return x.toDecimalPlaces(0)
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) { throw new TypeError(NO_INT) }

      return x.toDecimalPlaces(n.toNumber())
    },

    Fraction: function (x) {
      return x.round()
    },

    'Fraction, number': function (x, n) {
      if (n % 1) { throw new TypeError(NO_INT) }
      return x.round(n)
    }
  }, roundNumberSignatures))
    
  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.22)             // returns number 3
   *    math.round(3.82)             // returns number 4
   *    math.round(-4.2)             // returns number -4
   *    math.round(-4.7)             // returns number -5
   *    math.round(3.22, 1)          // returns number 3.2
   *    math.round(3.88, 1)          // returns number 3.9
   *    math.round(-4.21, 1)         // returns number -4.2
   *    math.round(-4.71, 1)         // returns number -4.7
   *    math.round(math.pi, 3)       // returns number 3.142
   *    math.round(123.45678, 2)     // returns number 123.46
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.round(c)                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]) // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number to be rounded
   * @param  {number | BigNumber | Array} [n=0]                            Number of decimals
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Rounded value
   */
  return typed(name, extend({
    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return deepMap(x, roundScalar, true)
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithmSs0(x, y, roundScalar, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithmDs(x, y, roundScalar, false)
    },

    'number | Complex | BigNumber, SparseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithmSsf(y, x, roundScalar, true)
    },

    'number | Complex | BigNumber, DenseMatrix': function (x, y) {
      // check scalar is zero
      if (equalScalar(x, 0)) {
        // do not execute algorithm, result will be a zero matrix
        return zeros(y.size(), y.storage())
      }
      return algorithmDs(y, x, roundScalar, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(x), y, roundScalar, false).valueOf()
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(y), x, roundScalar, true).valueOf()
    }
  })
})

export const createRoundNumber = /* #__PURE__ */ factory(name, ['typed'], ({ typed }) => {
  return typed(name, roundNumberSignatures)
})
