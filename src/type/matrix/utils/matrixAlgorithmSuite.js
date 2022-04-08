import { factory } from '../../../utils/factory.js'
import { extend } from '../../../utils/object.js'
import { createAlgorithmDD } from './algorithmDD.js'
import { createAlgorithmDs } from './algorithmDs.js'

const name = 'matrixAlgorithmSuite'
const dependencies = ['typed', 'matrix']

export const createMatrixAlgorithmSuite = /* #__PURE__ */ factory(
  name, dependencies, ({ typed, matrix }) => {
    const algorithmDD = createAlgorithmDD({ typed })
    const algorithmDs = createAlgorithmDs({ typed })

    /**
     * Return a signatures object with the usual boilerplate of
     * matrix algorithms, based on a plain options object with the
     * following properties:
     *   elop: function -- the elementwise operation to use, defaults to self
     *   SS: function -- the algorithm to apply for two sparse matrices
     *   DS: function -- the algorithm to apply for a dense and a sparse matrix
     *   SD: function -- algo for a sparse and a dense; defaults to SD flipped
     *   Ss: function -- the algorithm to apply for a sparse matrix and scalar
     *   sS: function -- algo for scalar and sparse; defaults to Ss flipped
     *   scalar: string -- typed-function type for scalars, defaults to 'any'
     * 
     * If Ss is not specified, no matrix-scalar signatures are generated.
     *
     * @param {object} options
     * @return {Object<string, function>} signatures
     */
    return function matrixAlgorithmSuite (options) {
      const elop = options.elop
      const SD = options.SD || options.DS
      const matrixSignatures = {
        // First the dense ones
        'DenseMatrix, DenseMatrix': (x, y) => algorithmDD(x, y, elop),
        'Array, Array': (x, y) =>
          algorithmDD(matrix(x), matrix(y), elop).valueOf(),
        'Array, DenseMatrix': (x, y) => algorithmDD(matrix(x), y, elop),
        'DenseMatrix, Array': (x, y) => algorithmDD(x, matrix(y), elop),
        // Now incorporate sparse matrices
        'SparseMatrix, SparseMatrix': (x, y) => options.SS(x, y, elop, false),
        'DenseMatrix, SparseMatrix': (x, y) => options.DS(x, y, elop, false),
        'Array, SparseMatrix': (x, y) => options.DS(matrix(x), y, elop, false),
        'SparseMatrix, DenseMatrix': (x, y) => SD(y, x, elop, true),
        'SparseMatrix, Array': (x, y) => SD(matrix(y), x, elop, true),
      }
      // Now add the scalars; can't be above because signatures are computed
      if (options.Ss) {
        const scalar = options.scalar || 'any'
        const sS = options.sS || options.Ss
        matrixSignatures['DenseMatrix,' + scalar] =
          (x, y) => algorithmDs(x, y, elop, false)
        matrixSignatures[scalar + ', DenseMatrix'] =
          (x, y) => algorithmDs(y, x, elop, true)
        matrixSignatures['Array,' + scalar] =
          (x, y) => algorithmDs(matrix(x), y, elop, false).valueOf()
        matrixSignatures[scalar + ', Array'] =
          (x, y) => algorithmDs(matrix(y), x, elop, true).valueOf()
        matrixSignatures['SparseMatrix,' + scalar] =
          (x, y) => options.Ss(x, y, elop, false)
        matrixSignatures[scalar + ', SparseMatrix'] =
          (x, y) => sS(y, x, elop, true)
      }
      // Also pull in the scalar signatures if the operator is a typed function
      if (typed.isTypedFunction(elop)) {
        extend(matrixSignatures, elop.signatures)
      }
      return matrixSignatures
    }
  })
