import { factory } from '../../utils/factory.js'
import { createAlgorithmDD } from '../../type/matrix/utils/algorithmDD.js'
import { createAlgorithmDs } from '../../type/matrix/utils/algorithmDs.js'

const name = 'to'
const dependencies = [
  'typed',
  'matrix'
]

export const createTo = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  const algorithmDD = createAlgorithmDD({ typed })
  const algorithmDs = createAlgorithmDs({ typed })

  /**
   * Change the unit of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.to(x, unit)
   *
   * Examples:
   *
   *    math.to(math.unit('2 inch'), 'cm')                   // returns Unit 5.08 cm
   *    math.to(math.unit('2 inch'), math.unit(null, 'cm'))  // returns Unit 5.08 cm
   *    math.to(math.unit(16, 'bytes'), 'bits')              // returns Unit 128 bits
   *
   * See also:
   *
   *    unit
   *
   * @param {Unit | Array | Matrix} x     The unit to be converted.
   * @param {Unit | Array | Matrix} unit  New unit. Can be a string like "cm"
   *                                      or a unit without value.
   * @return {Unit | Array | Matrix} value with changed, fixed unit.
   */
  const unitTo = typed({'Unit, Unit | string': (x, unit) => x.to(unit)})

  return typed(name, unitTo, {
    'Matrix, Matrix': function (x, y) {
      // SparseMatrix does not support Units
      return algorithmDD(x, y, unitTo)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return algorithmDD(matrix(x), matrix(y), unitTo).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return algorithmDD(matrix(x), y, unitTo)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return algorithmDD(x, matrix(y), unitTo)
    },

    'Matrix, any': function (x, y) {
      // SparseMatrix does not support Units
      return algorithmDs(x, y, unitTo, false)
    },

    'any, Matrix': function (x, y) {
      // SparseMatrix does not support Units
      return algorithmDs(y, x, unitTo, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(x), y, unitTo, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithmDs(matrix(y), x, unitTo, true).valueOf()
    }
  })
})
