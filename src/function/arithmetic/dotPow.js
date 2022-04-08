import { factory } from '../../utils/factory.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'dotPow'
const dependencies = [
  'typed',
  'equalScalar',
  'matrix',
  'pow',
  'DenseMatrix'
]

export const createDotPow = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar, matrix, pow, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.dotPow(x, y)
   *
   * Examples:
   *
   *    math.dotPow(2, 3)            // returns number 8
   *
   *    const a = [[1, 2], [4, 3]]
   *    math.dotPow(a, 2)            // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2)               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y  The exponent
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
   */
  return typed(name,
    { 'any, any': pow },
    matrixAlgorithmSuite({
      elop: (x, y) => pow(x, y), // pow has matrix signatures we don't want
      SS: algorithmSSff,
      DS: algorithmDSf,
      Ss: algorithmSs0,
      sS: algorithmSsf,
    }))
})
