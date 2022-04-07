import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmSS00 } from '../../type/matrix/utils/algorithmSS00.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { factory } from '../../utils/factory.js'
import { andNumber } from '../../plain/number/index.js'

const name = 'and'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'not'
]

export const createAnd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, not }) => {
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmSS00 = createAlgorithmSS00({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmDs = createAlgorithmDs({ typed })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const andScalar = typed({
    'number, number': andNumber,

    'Complex, Complex': function (x, y) {
      return (x.re !== 0 || x.im !== 0) && (y.re !== 0 || y.im !== 0)
    },

    'BigNumber, BigNumber': function (x, y) {
      return !x.isZero() && !y.isZero() && !x.isNaN() && !y.isNaN()
    },

    'Unit, Unit': typed.referToSelf(self => (x, y) => {
      return self(x.value || 0, y.value || 0)
    })
  })

  /**
   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(2, 4)   // returns true
   *
   *    a = [2, 0, 0]
   *    b = [3, 7, 0]
   *    c = 0
   *
   *    math.and(a, b)   // returns [true, false, false]
   *    math.and(a, c)   // returns [false, false, false]
   *
   * See also:
   *
   *    not, or, xor
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when both inputs are defined with a nonzero/nonempty value.
   */
  return typed(
    name,
    extend(
      matrixAlgorithmSuite({
        elop: andScalar,
        SS: algorithmSS00,
        DS: algorithmDS0
      }), { // No scalar methods above; special code below
        'SparseMatrix, any': function (x, y) {
          // check scalar
          if (not(y)) {
            // return zero matrix
            return zeros(x.size(), x.storage())
          }
          return algorithmSs0(x, y, this, false)
        },

        'DenseMatrix, any': function (x, y) {
          // check scalar
          if (not(y)) {
            // return zero matrix
            return zeros(x.size(), x.storage())
          }
          return algorithmDs(x, y, this, false)
        },

        'any, SparseMatrix': function (x, y) {
          // check scalar
          if (not(x)) {
            // return zero matrix
            return zeros(x.size(), x.storage())
          }
          return algorithmSs0(y, x, this, true)
        },

        'any, DenseMatrix': function (x, y) {
          // check scalar
          if (not(x)) {
            // return zero matrix
            return zeros(x.size(), x.storage())
          }
          return algorithmDs(y, x, this, true)
        },

        'Array, any': typed.referTo('DenseMatrix, any', andDs => (x, y) => {
          // use matrix implementation
          return andDs(matrix(x), y).valueOf()
        }),

        'any, Array': typed.referTo('any, DenseMatrix', andsD => (x, y) => {
          // use matrix implementation
          return andsD(x, matrix(y)).valueOf()
        })
      }))
})
