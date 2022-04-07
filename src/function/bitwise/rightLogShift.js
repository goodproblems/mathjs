import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'
import { createAlgorithmSs1 } from '../../type/matrix/utils/algorithmSs1.js'
import { createAlgorithmS1S0 } from '../../type/matrix/utils/algorithmS1S0.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { factory } from '../../utils/factory.js'
import { rightLogShiftNumber } from '../../plain/number/index.js'

const name = 'rightLogShift'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix'
]

export const createRightLogShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, DenseMatrix }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmS1S0 = createAlgorithmS1S0({ typed, equalScalar })
  const algorithmDs = createAlgorithmDs({ typed })
  const algorithmSs1 = createAlgorithmSs1({ typed, DenseMatrix })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2)               // returns number 1
   *
   *    math.rightLogShift([16, -32, 64], 4)   // returns Array [1, 2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
   *
   * @param  {number | Array | Matrix} x Value to be shifted
   * @param  {number} y Amount of shifts
   * @return {number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  // TODO: implement BigNumber support for rightLogShift
  
  return typed(
    name,
    extend(
      matrixAlgorithmSuite({
        elop: rightLogShiftNumber,
        SS: algorithmS1S0,
        DS: algorithmDS1,
        SD: algorithmDS0
      }), { // No scalar methods above; special code below
        'SparseMatrix, number': function (x, y) {
          // check scalar
          if (equalScalar(y, 0)) {
            return x.clone()
          }
          return algorithmSs0(x, y, this, false)
        },

        'DenseMatrix, number': function (x, y) {
          // check scalar
          if (equalScalar(y, 0)) {
            return x.clone()
          }
          return algorithmDs(x, y, this, false)
        },

        'number, SparseMatrix': function (x, y) {
          // check scalar
          if (equalScalar(x, 0)) {
            return zeros(y.size(), y.storage())
          }
          return algorithmSs1(y, x, this, true)
        },

        'number, DenseMatrix': function (x, y) {
          // check scalar
          if (equalScalar(x, 0)) {
            return zeros(y.size(), y.storage())
          }
          return algorithmDs(y, x, this, true)
        },

        'Array, number': typed.referToSelf(self => (x, y) => {
          // use matrix implementation
          return self(matrix(x), y).valueOf()
        }),

        'number, Array': typed.referToSelf(self => (x, y) => {
          // use matrix implementation
          return self(x, matrix(y)).valueOf()
        })
      }))
})
