import { factory } from '../../utils/factory.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSS00 } from '../../type/matrix/utils/algorithmSS00.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { lcmNumber } from '../../plain/number/index.js'

const name = 'lcm'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createLcm = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmSS00 = createAlgorithmSS00({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const lcmScalar = typed(lcmNumber, _lcmBigNumber, _lcmFraction)
  const lcmTypes = 'number | BigNumber | Fraction | Matrix | Array'
  const lcmManySignature = {}
  lcmManySignature[`${lcmTypes}, ${lcmTypes}, ...${lcmTypes}`] =
    typed.referToSelf(self => (a, b, args) => {
      let res = self(a, b)
      for (let i = 0; i < args.length; i++) {
        res = self(res, args[i])
      }
      return res
    })

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6)               // returns 12
   *    math.lcm(6, 21)              // returns 42
   *    math.lcm(6, 21, 5)           // returns 210
   *
   *    math.lcm([4, 6], [6, 21])    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... number | BigNumber | Fraction | Array | Matrix} args  Two or more integer numbers
   * @return {number | BigNumber | Array | Matrix}                           The least common multiple
   */
  return typed(name, extend(matrixAlgorithmSuite({
    elop: lcmScalar,
    SS: algorithmSS00,
    DS: algorithmDS0,
    Ss: algorithmSs0
  }), lcmManySignature))

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber (a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers')
    }

    if (a.isZero()) {
      return a
    }
    if (b.isZero()) {
      return b
    }

    // https://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    const prod = a.times(b)
    while (!b.isZero()) {
      const t = b
      b = a.mod(t)
      a = t
    }
    return prod.div(a).abs()
  }
  _lcmBigNumber.signature = 'BigNumber, BigNumber'

  function _lcmFraction (x, y) {
    return x.lcm(y)
  }
  _lcmFraction.signature = 'Fraction, Fraction'
})
