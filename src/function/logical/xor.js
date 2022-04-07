import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSff } from '../../type/matrix/utils/algorithmSSff.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { factory } from '../../utils/factory.js'
import { xorNumber } from '../../plain/number/index.js'

const name = 'xor'
const dependencies = [
  'typed',
  'matrix',
  'DenseMatrix'
]

export const createXor = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, DenseMatrix }) => {
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSff = createAlgorithmSSff({ typed, DenseMatrix })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const xorScalar = typed({
    'number, number': xorNumber,

    'Complex, Complex': function (x, y) {
      return ((x.re !== 0 || x.im !== 0) !== (y.re !== 0 || y.im !== 0))
    },

    'BigNumber, BigNumber': function (x, y) {
      return ((!x.isZero() && !x.isNaN()) !== (!y.isZero() && !y.isNaN()))
    },

    'Unit, Unit': typed.referToSelf(self => (x, y) => {
      return this(x.value || 0, y.value || 0)
    })
  })
    
  /**
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(2, 4)   // returns false
   *
   *    a = [2, 0, 0]
   *    b = [2, 7, 0]
   *    c = 0
   *
   *    math.xor(a, b)   // returns [false, true, false]
   *    math.xor(a, c)   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  return typed(name, matrixAlgorithmSuite({
    elop: xorScalar,
    SS: algorithmSSff,
    DS: algorithmDSf,
    Ss: algorithmSsf
  })
})
