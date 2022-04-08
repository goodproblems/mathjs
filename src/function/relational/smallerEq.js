import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'


const name = 'smallerEq'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'DenseMatrix'
]

function smallerEqEpsilon (conf) {
  return function (x, y) {
    return x <= y || nearlyEqual(x, y, conf.epsilon)
  }
}

export const createSmallerEq = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const smallerEqScalar = typed({
    'boolean, boolean': (x, y) => x <= y,
    'number, number': smallerEqEpsilon(config),
    'BigNumber, BigNumber': function (x, y) {
      return x.lte(y) || bigNearlyEqual(x, y, config.epsilon)
    },
    'Fraction, Fraction': function (x, y) {
      return x.compare(y) !== 1
    },
    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers')
    },
    'Unit, Unit': typed.referToSelf( self => (x, y) => {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return self(x.value, y.value)
    })
  })

  /**
   * Test whether value x is smaller or equal to y.
   *
   * The function returns true when x is smaller than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.smallerEq(x, y)
   *
   * Examples:
   *
   *    math.smaller(1 + 2, 3)        // returns false
   *    math.smallerEq(1 + 2, 3)      // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  return typed(name, matrixAlgorithmSuite({
    elop: smallerEqScalar,
    SS: algorithmSSff,
    DS: algorithmDSf,
    Ss: algorithmSsf
  }))
})

export const createSmallerEqNumber = /* #__PURE__ */ factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, { 'number, number': smallerEqEpsilon(config) })
})
