import { bitXor as bigBitXor } from '../../utils/bignumber/bitwise.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { factory } from '../../utils/factory.js'
import { bitXorNumber } from '../../plain/number/index.js'

const name = 'bitXor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix'
]

export const createBitXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const bitXorScalar = typed({
    'number, number': bitXorNumber,
    'BigNumber, BigNumber': bigBitXor
  })
    
  /**
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitXor(x, y)
   *
   * Examples:
   *
   *    math.bitXor(1, 2)               // returns number 3
   *
   *    math.bitXor([2, 3, 4], 4)       // returns Array [6, 7, 0]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x First value to xor
   * @param  {number | BigNumber | Array | Matrix} y Second value to xor
   * @return {number | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: bitXorScalar,
    SS: algorithmSSff,
    DS: algorithmDSf,
    Ss: algorithmSsf
  }))
})
