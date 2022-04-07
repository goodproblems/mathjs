import { factory } from '../../utils/factory.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSfS0 } from '../../type/matrix/utils/algorithmSfS0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'


const name = 'dotMultiply'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'multiplyScalar'
]

export const createDotMultiply = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, multiplyScalar }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmSfS0 = createAlgorithmSfS0({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4) // returns 8
   *
   *    a = [[9, 5], [6, 1]]
   *    b = [[3, 2], [5, 2]]
   *
   *    math.dotMultiply(a, b) // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b)    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Left hand value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Right hand value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: multiplyScalar,
    SS: algorithmSfS0,
    DS: algorithmDS0,
    Ss: algorithmSs0
  }))
})
