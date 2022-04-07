import { bitAndBigNumber } from '../../utils/bignumber/bitwise.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSS00 } from '../../type/matrix/utils/algorithmSS00.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { factory } from '../../utils/factory.js'
import { bitAndNumber } from '../../plain/number/index.js'

const name = 'bitAnd'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar'
]

export const createBitAnd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmSS00 = createAlgorithmSS00({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const bitAndScalar = typed({
    'number, number': bitAndNumber,
    'BigNumber, BigNumber': bitAndBigNumber,
  })
  
  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitAnd(x, y)
   *
   * Examples:
   *
   *    math.bitAnd(53, 131)               // returns number 1
   *
   *    math.bitAnd([1, 12, 31], 42)       // returns Array [0, 8, 10]
   *
   * See also:
   *
   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to and
   * @param  {number | BigNumber | Array | Matrix} y Second value to and
   * @return {number | BigNumber | Array | Matrix} AND of `x` and `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: bitAndScalar,
    SS: algorithmSS00,
    DS: algorithmDS0,
    Ss: algorithmSs0
  }))
})
