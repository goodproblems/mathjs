import { factory } from '../../utils/factory.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSf0 } from '../../type/matrix/utils/algorithmSSf0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { modNumber } from '../../plain/number/index.js'

const name = 'mod'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

export const createMod = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSf0 = createAlgorithmSSf0({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const modScalar = typed({
    'number, number': modNumber,

    'BigNumber, BigNumber': function (x, y) {
      if (y.isNeg()) {
        throw new Error('Cannot calculate mod for a negative divisor')
      }
      return y.isZero() ? x : x.mod(y)
    },

    'Fraction, Fraction': function (x, y) {
      if (y.compare(0) < 0) {
        throw new Error('Cannot calculate mod for a negative divisor')
      }
      // Workaround suggested in Fraction.js library to calculate correct modulo for negative dividend
      return x.compare(0) >= 0 ? x.mod(y) : x.mod(y).add(y).mod(y)
    }
  })
    
  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See https://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  return typed(name, matrixAlgorithmSuite({
    elop: modScalar,
    SS: algorithmSSf0,
    DS: algorithmDSf,
    SD: algorithmDS0,
    Ss: algorithmSs0,
    sS: algorithmSsf
  }))
})
