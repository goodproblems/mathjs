import { factory } from '../../utils/factory.js'
import { DimensionError } from '../../error/DimensionError.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import { createAlgorithmDSf } from '../../type/matrix/utils/algorithmDSf.js'
import { createAlgorithmSSf0 } from '../../type/matrix/utils/algorithmSSf0.js'
import { createAlgorithmSsf } from '../../type/matrix/utils/algorithmSsf.js'
import { createAlgorithmSs1 } from '../../type/matrix/utils/algorithmSs1.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'subtract'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'addScalar',
  'unaryMinus',
  'DenseMatrix'
]

export const createSubtract = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, addScalar, unaryMinus, DenseMatrix }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmDSf = createAlgorithmDSf({ typed })
  const algorithmSSf0 = createAlgorithmSSf0({ typed, equalScalar })
  const algorithmSsf = createAlgorithmSsf({ typed, DenseMatrix })
  const algorithmSs1 = createAlgorithmSs1({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  const subtractScalar = typed({
    'number, number': (x, y) => x - y,
    'Complex, Complex': (x, y) => x.sub(y),
    'BigNumber, BigNumber': (x, y) => x.minus(y),
    'Fraction, Fraction': (x, y) => x.sub(y),
    'Unit, Unit': typed.referToSelf(self => (x, y) => {
      if (x.value === null) {
        throw new Error('Parameter x contains a unit with undefined value')
      }

      if (y.value === null) {
        throw new Error('Parameter y contains a unit with undefined value')
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match')
      }

      const res = x.clone()
      res.value = self(res.value, y.value)
      res.fixPrefix = false

      return res
    })
  })

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  return typed(name, matrixAlgorithmSuite({
    elop: subtractScalar,
    SS: algorithmSSf0,
    DS: algorithmDS1,
    SD: algorithmDSf,
    Ss: algorithmSsf,
    sS: algorithmSs1
  }))
})
