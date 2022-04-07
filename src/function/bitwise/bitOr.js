import { bitOrBigNumber } from '../../utils/bignumber/bitwise.js'
import { factory } from '../../utils/factory.js'
import { createAlgorithmSs1 } from '../../type/matrix/utils/algorithmSs1.js'
import { createAlgorithmSS10 } from '../../type/matrix/utils/algorithmSS10.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { bitOrNumber } from '../../plain/number/index.js'

const name = 'bitOr'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix'
]

export const createBitOr = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmSS10 = createAlgorithmSS10({ typed, equalScalar })
  const algorithmSs1 = createAlgorithmSs1({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const bitOrScalar = typed(bitOrNumber, bitOrBigNumber)

  /**
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.bitOr(x, y)
   *
   * Examples:
   *
   *    math.bitOr(1, 2)               // returns number 3
   *
   *    math.bitOr([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to or
   * @param  {number | BigNumber | Array | Matrix} y Second value to or
   * @return {number | BigNumber | Array | Matrix} OR of `x` and `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: bitOrScalar,
    SS: algorithmSS10,
    DS: algorithmDS1,
    Ss: algorithmSs1,
  }))
})
