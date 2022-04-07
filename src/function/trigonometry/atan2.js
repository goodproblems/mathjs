import { factory } from '../../utils/factory.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSfS0 } from '../../type/matrix/utils/algorithmSfS0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'atan2'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber',
  'DenseMatrix'
]

export const createAtan2 = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber, DenseMatrix }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSfS0 = createAlgorithmSfS0({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const atan2Scalar = typed({
    'number, number': Math.atan2,

    // Complex numbers doesn't seem to have a reasonable implementation of
    // atan2(). Even Matlab removed the support, after they only calculated
    // the atan only on base of the real part of the numbers and ignored the imaginary.

    'BigNumber, BigNumber': function (y, x) {
      return BigNumber.atan2(y, x)
    }
  })
    
  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi       // returns number 0.25
   *
   *    const angle = math.unit(60, 'deg') // returns Unit 60 deg
   *    const x = math.cos(angle)
   *    const y = math.sin(angle)
   *
   *    math.atan(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {number | Array | Matrix} y  Second dimension
   * @param {number | Array | Matrix} x  First dimension
   * @return {number | Array | Matrix} Four-quadrant inverse tangent
   */
  return typed(name, matrixAlgorithmSuite({
    elop: atan2Scalar,
    scalar: 'number | BigNumber',
    SS: algorithmSfS0,
    DS: algorithmDSf,
    SD: algorithmDS0,
    Ss: algorithmSs0,
    sS: algorithmSsf
  }))
})
