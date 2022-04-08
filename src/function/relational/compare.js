import { nearlyEqual as bigNearlyEqual } from '../../utils/bignumber/nearlyEqual.js'
import { nearlyEqual } from '../../utils/number.js'
import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import { createAlgorithmSSf0 } from '../../type/matrix/utils/algorithmSSf0.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'compare'
const dependencies = [
  'typed',
  'config',
  'matrix',
  'equalScalar',
  'BigNumber',
  'Fraction',
  'DenseMatrix'
]

function compareEpsilon (conf) {
  return function (x, y) {
    return nearlyEqual(x, y, conf.epsilon)
      ? 0
      : (x > y ? 1 : -1)
  }
}

export const createCompare = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, equalScalar, matrix, BigNumber, Fraction, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSf0 = createAlgorithmSSf0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const compareScalar = typed({
    'boolean, boolean': (x, y) => x === y ? 0 : (x > y ? 1 : -1),
    'number, number': compareEpsilon(config),
    'BigNumber, BigNumber': function (x, y) {
      return bigNearlyEqual(x, y, config.epsilon)
        ? new BigNumber(0)
        : new BigNumber(x.cmp(y))
    },
    'Fraction, Fraction': function (x, y) {
      return new Fraction(x.compare(y))
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
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1)           // returns 1
   *    math.compare(2, 3)           // returns -1
   *    math.compare(7, 7)           // returns 0
   *    math.compare('10', '2')      // returns 1
   *    math.compare('1000', '1e3')  // returns 0
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('40 mm')
   *    math.compare(a, b)           // returns 1
   *
   *    math.compare(2, [1, 2, 3])   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compareNatural, compareText
   *
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} y Second value to compare
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the result of the comparison:
   *                                                          1 when x > y, -1 when x < y, and 0 when x == y.
   */
  return typed(name, matrixAlgorithmSuite({
    elop: compareScalar,
    SS: algorithmSSf0,
    DS: algorithmDSf,
    Ss: algorithmSsf
  }))
})

export const createCompareNumber = /* #__PURE__ */ factory(name, ['typed', 'config'], ({ typed, config }) => {
  return typed(name, { 'number, number': compareEpsilon(config) })
})
