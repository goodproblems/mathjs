import { factory } from '../../utils/factory.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import { createAlgorithmDS0 } from '../../type/matrix/utils/algorithmDS0.js'
import { createAlgorithmSS00 } from '../../type/matrix/utils/algorithmSS00.js'
import { createAlgorithmSs0 } from '../../type/matrix/utils/algorithmSs0.js'
import { createAlgorithmDD } from '../../type/matrix/utils/algorithmDD.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'
import { nthRootNumber } from '../../plain/number/index.js'

const name = 'nthRoot'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'BigNumber'
]

export const createNthRoot = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, BigNumber }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmDS0 = createAlgorithmDS0({ typed, equalScalar })
  const algorithmSS00 = createAlgorithmSS00({ typed, equalScalar })
  const algorithmSs0 = createAlgorithmSs0({ typed, equalScalar })
  const algorithmDD = createAlgorithmDD({ typed })
  const algorithmDs = createAlgorithmDs({ typed })

  const complexErr = ('' +
    'Complex number not supported in function nthRoot. ' +
    'Use nthRoots instead.'
  )
  const nthRootScalar = typed({
    number: function (x) {
      return nthRootNumber(x, 2)
    },

    'number, number': nthRootNumber,

    BigNumber: function (x) {
      return _bigNthRoot(x, new BigNumber(2))
    },
    Complex: function (x) {
      throw new Error(complexErr)
    },
    'Complex, number': function (x, y) {
      throw new Error(complexErr)
    },
    'BigNumber, BigNumber': _bigNthRoot
  })
    
  /**
   * Calculate the nth root of a value.
   * The principal nth root of a positive real number A, is the positive real
   * solution of the equation
   *
   *     x^root = A
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *     math.nthRoot(a)
   *     math.nthRoot(a, root)
   *
   * Examples:
   *
   *     math.nthRoot(9, 2)    // returns 3, as 3^2 == 9
   *     math.sqrt(9)          // returns 3, as 3^2 == 9
   *     math.nthRoot(64, 3)   // returns 4, as 4^3 == 64
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param {number | BigNumber | Array | Matrix | Complex} a
   *              Value for which to calculate the nth root
   * @param {number | BigNumber} [root=2]    The root.
   * @return {number | Complex | Array | Matrix} Returns the nth root of `a`
   */
  return typed(name, extend({
    'Array | Matrix': typed.referToSelf(self => (x) => self(x, 2)),

    'SparseMatrix, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse + sparse
        return algorithmSS00(x, y, nthRootScalar)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithmDS0(y, x, nthRootScalar, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // dense + sparse
        return algorithmDS1(x, y, nthRootScalar, false)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithmDD(x, y, nthRootScalar)
    },

    'Array, Array':
    typed.referTo('DenseMatrix, DenseMatrix', nthRootDD => (x, y) => {
      // use matrix implementation
      return nthRootDD(matrix(x), matrix(y)).valueOf()
    }),

    'Array, Matrix': typed.referToSelf(self => (x, y) => {
      // use matrix implementation
      return self(matrix(x), y)
    }),

    'Matrix, Array': typed.referToSelf(selfr => (x, y) => {
      // use matrix implementation
      return self(x, matrix(y))
    }),

    'SparseMatrix, number | BigNumber': function (x, y) {
      return algorithmSs0(x, y, nthRootScalar, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      return algorithmDs(x, y, nthRootScalar, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse - scalar
        return algorithmSs0(y, x, nthRootScalar, true)
      } else {
        // throw exception
        throw new Error('Root must be non-zero')
      }
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      return algorithmDs(y, x, nthRootScalar, true)
    },

    'Array, number | BigNumber': typed.referToSelf(self => (x, y) {
      // use matrix implementation
      return self(matrix(x), y).valueOf()
    }),

    'number | BigNumber, Array': typed.referToSelf(self => (x, y) {
      // use matrix implementation
      return self(x, matrix(y)).valueOf()
    })
  }, nthRootScalar.signatures))

  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * https://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} root
   * @private
   */
  function _bigNthRoot (a, root) {
    const precision = BigNumber.precision
    const Big = BigNumber.clone({ precision: precision + 2 })
    const zero = new BigNumber(0)

    const one = new Big(1)
    const inv = root.isNegative()
    if (inv) {
      root = root.neg()
    }

    if (root.isZero()) {
      throw new Error('Root must be non-zero')
    }
    if (a.isNegative() && !root.abs().mod(2).equals(1)) {
      throw new Error('Root must be odd when a is negative.')
    }

    // edge cases zero and infinity
    if (a.isZero()) {
      return inv ? new Big(Infinity) : 0
    }
    if (!a.isFinite()) {
      return inv ? zero : a
    }

    let x = a.abs().pow(one.div(root))
    // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1
    x = a.isNeg() ? x.neg() : x
    return new BigNumber((inv ? one.div(x) : x).toPrecision(precision))
  }
})

export const createNthRootNumber = /* #__PURE__ */ factory(name, ['typed'], ({ typed }) => {
  return typed(name, {
    number: nthRootNumber,
    'number, number': nthRootNumber
  })
})
