import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'larger'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'DenseMatrix'
]

Function largerEpsilon (eps) {
  return function (x, y) {
    return x > y && !nearlyEqual(x, y, eps)
  }
}

export const createLarger = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const largerScalar = typed({
    'boolean, boolean': (x, y) => x > y,
    'number, number': largerEpsilon(config.epsilon),
    'BigNumber, BigNumber': function (x, y) {
      return x.gt(y) && !bigNearlyEqual(x, y, config.epsilon)
    },
    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === 1
    },
    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers')
    },
    'Unit, Unit': typed.referToSelf(self => (x, y) => {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return self(x.value, y.value)
    })
  })

  /**
   * Test whether value x is larger than y.
   *
   * The function returns true when x is larger than y and the relative
   * difference between x and y is larger than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.larger(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 3)             // returns false
   *    math.larger(5, 2 + 2)         // returns true
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('2 inch')
   *    math.larger(a, b)             // returns false
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
   */
  return typed(name, matrixAlgorithmSuite({
    elop: largerScalar,
    SS: algorithmSSff,
    DS: algorithmDSf,
    Ss: algorithmSsf
  }))
})

export const createLargerNumber = /* #__PURE__ */ factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, { 'number, number': largerEpsilon(config.epsilon) })
})
