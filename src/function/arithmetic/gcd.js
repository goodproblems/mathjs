import { factory } from '../../utils/factory.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import { createAlgorithmSS10 } from '../../type/matrix/utils/algorithmSS10.js'
import { createAlgorithmSs1 } from '../../type/matrix/utils/algorithmSs1.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { gcdNumber } from '../../plain/number/index.js'

const name = 'gcd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createGcd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmSS10 = createAlgorithmSS10({ typed, equalScalar })
  const algorithmSs1 = createAlgorithmSs1({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const gcdScalar = typed(gcdNumber, _gcdBigNumber, _gcdFraction)
  const gcdTypes = 'number | BigNumber | Fraction | Matrix | Array'
  const gcdManySignature = {}
  gcdManySignature[`${gcdTypes}, ${gcdTypes}, ...${gcdTypes}`] =
    typed.referToSelf(self => (a, b, args) => {
      let res = self(a, b)
      for (let i = 0; i < args.length; i++) {
        res = self(res, args[i])
      }
      return res
    })

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12)              // returns 4
   *    math.gcd(-4, 6)              // returns 2
   *    math.gcd(25, 15, -10)        // returns 5
   *
   *    math.gcd([8, -4], [12, 6])   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Fraction | Array | Matrix}                           The greatest common divisor
   */
  return typed(name, extend(matrixAlgorithmSuite({
    elop: gcdScalar,
    SS: algorithmSS10,
    DS: algorithmDS1,
    Ss: algorithmSs1,
  }), gcdManySignature))

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers')
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    const zero = new BigNumber(0)
    while (!b.isZero()) {
      const r = a.mod(b)
      a = b
      b = r
    }
    return a.lt(zero) ? a.neg() : a
  }
  _gcdBigNumber.signature = 'BigNumber, BigNumber'

  function _gcdFraction (x, y) {
    return x.gcd(y)
  }
  _gcdFraction.signature = 'Fraction, Fraction'
})
