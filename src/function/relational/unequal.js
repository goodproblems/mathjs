import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'unequal'
const dependencies = [
  'typed',
  'config',
  'equalScalar',
  'matrix',
  'DenseMatrix'
]

function baseUnequal (equal) {
  return function (x, y) {
    // strict equality for null and undefined?
    if (x === null) { return y !== null }
    if (y === null) { return x !== null }
    if (x === undefined) { return y !== undefined }
    if (y === undefined) { return x !== undefined }

    return !equal(x, y)
  }
}

export const createUnequal = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, equalScalar, matrix, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  function _unequal (x, y) {
    return !equalScalar(x, y)
  }

  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   * Strings are compared by their numerical value.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everything
   * except `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3)       // returns true
   *    math.unequal(2 + 2, 4)       // returns false
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.unequal(a, b)           // returns false
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.unequal(c, d)           // returns [false, true, false]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.unequal(0, null)        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */
  return typed('unequal', { 'any, any': baseUnequal(equalScalar) },
    matrixAlgorithmSuite({
      elop: _unequal,
      SS: algorithmSSff,
      DS: algorithmDSf,
      Ss: algorithmSsf
    }))
})

export const createUnequalNumber = factory(name, ['typed', 'equalScalar'], ({ typed, equalScalar }) => {
  return typed(name, { 'any, any': baseUnequal(equalScalar) })
})
