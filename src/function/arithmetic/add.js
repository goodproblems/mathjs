import { factory } from '../../utils/factory.js'
import { extend } from '../../utils/object.js'
import { createAlgorithmDS1 } from '../../type/matrix/utils/algorithmDS1.js'
import { createAlgorithmSS10 } from '../../type/matrix/utils/algorithmSS10.js'
import { createAlgorithmSs1 } from '../../type/matrix/utils/algorithmSs1.js'
import {
  createMatrixAlgorithmSuite
} from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'add'
const dependencies = [
  'typed',
  'matrix',
  'addScalar',
  'equalScalar',
  'DenseMatrix',
  'SparseMatrix'
]

export const createAdd = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, addScalar, equalScalar, DenseMatrix, SparseMatrix }) => {
  const algorithmDS1 = createAlgorithmDS1({ typed })
  const algorithmSS10 = createAlgorithmSS10({ typed, equalScalar })
  const algorithmSs1 = createAlgorithmSs1({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Add two or more values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *    math.add(x, y, z, ...)
   *
   * Examples:
   *
   *    math.add(2, 3)               // returns number 5
   *    math.add(2, 3, 4)            // returns number 9
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(-4, 1)
   *    math.add(a, b)               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4)       // returns Array [5, 6, 7]
   *
   *    const c = math.unit('5 cm')
   *    const d = math.unit('2.1 mm')
   *    math.add(c, d)               // returns Unit 52.1 mm
   *
   *    math.add("2.3", "4")         // returns number 6.3
   *
   * See also:
   *
   *    subtract, sum
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */
  return typed(
    name,
    extend(
      matrixAlgorithmSuite({
        elop: addScalar,
        SS: algorithmSS10,
        DS: algorithmDS1,
        Ss: algorithmSs1
      }), {
        'any, any, ...any': typed.referToSelf(self => (x, y, rest) => {
          let result = this(x, y)
          for (let i = 0; i < rest.length; i++) {
            result = this(result, rest[i])
          }
          
          return result
        })
      }))
})
