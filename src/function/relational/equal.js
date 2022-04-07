import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'equal'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

function baseEqual (equal) {
  return function (x, y) {
    // strict equality for null and undefined?
    if (x === null) { return y === null }
    if (y === null) { return x === null }
    if (x === undefined) { return y === undefined }
    if (y === undefined) { return x === undefined }

    return equal(x, y)
  }
}

export const createEqual = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else. Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3)         // returns false
   *    math.equal(2 + 2, 4)         // returns true
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.equal(a, b)             // returns true
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.equal(c, d)             // returns [true, false, true]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.equal("1000", "1e3")    // returns true
   *    math.equal(0, null)          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual, equalText
   *
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  return typed(name, extend(
    { 'any, any': baseEqual(equalScalar) },
    matrixAlgorithmSuite({
      elop: equalScalar,
      SS: algorithmSSff,
      DS: algorithmDSf,
      Ss: algorithmSsf
    })))
})      

export const createEqualNumber = factory(name, ['typed', 'equalScalar'], ({ typed, equalScalar }) => {
  return typed(name, { 'any, any': baseUnequal(equalScalar) })
})
