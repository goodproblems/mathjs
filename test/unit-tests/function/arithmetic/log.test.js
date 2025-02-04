// test log
import assert from 'assert'

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const log = math.log

describe('log', function () {
  it('should return the log of a boolean value', function () {
    assert.strictEqual(log(true), 0)
    assert.strictEqual(log(false), -Infinity)
    assert.strictEqual(log(1, false), -0)
  })

  it('should return the log of positive numbers', function () {
    approx.deepEqual(log(1), 0)
    approx.deepEqual(log(2), 0.693147180559945)
    approx.deepEqual(log(3), 1.098612288668110)
    approx.deepEqual(math.exp(log(100)), 100)
  })

  it('should return the log of negative numbers', function () {
    approx.deepEqual(log(-1), complex('0.000000000000000 + 3.141592653589793i'))
    approx.deepEqual(log(-2), complex('0.693147180559945 + 3.141592653589793i'))
    approx.deepEqual(log(-3), complex('1.098612288668110 + 3.141592653589793i'))
  })

  it('should return the log of negative numbers with predictable: true', function () {
    assert.strictEqual(typeof mathPredictable.log(-1), 'number')
    assert(isNaN(mathPredictable.log(-1)))
  })

  it('should return the log of zero', function () {
    approx.deepEqual(log(0), -Infinity)
  })

  it('should return the log base N of a number', function () {
    approx.deepEqual(log(100, 10), 2)
    approx.deepEqual(log(1000, 10), 3)
    approx.deepEqual(log(8, 2), 3)
    approx.deepEqual(log(16, 2), 4)
  })

  it('should throw an error if invalid number of arguments', function () {
    assert.throws(function () { log() }, /TypeError: Too few arguments in function log \(expected: any, index: 0\)/)
    assert.throws(function () { log(1, 2, 3) }, /TypeError: Too many arguments in function log \(expected: 2, actual: 3\)/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { log(null) }, /Too few arguments/) // TODO: this is a misleading error message
  })

  it('should return the log of positive bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log(bigmath.bignumber(1)), bigmath.bignumber('0'))
    assert.deepStrictEqual(bigmath.log(bigmath.bignumber(2)), bigmath.bignumber('0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875'))
    assert.deepStrictEqual(bigmath.log(bigmath.bignumber(3)), bigmath.bignumber('1.098612288668109691395245236922525704647490557822749451734694333637494293218608966873615754813732089'))

    // note: the following gives a round-off error with regular numbers
    assert.deepStrictEqual(bigmath.log(bigmath.bignumber(1000), bigmath.bignumber(10)), bigmath.bignumber(3))
  })

  it('should return the log of negative bignumbers', function () {
    const bigmath = math.create({ precision: 100 })

    approx.deepEqual(bigmath.log(bigmath.bignumber(-1)), complex('0.000000000000000 + 3.141592653589793i'))
    approx.deepEqual(bigmath.log(bigmath.bignumber(-2)), complex('0.693147180559945 + 3.141592653589793i'))
    approx.deepEqual(bigmath.log(bigmath.bignumber(-3)), complex('1.098612288668110 + 3.141592653589793i'))
  })

  it('should return the log of negative bignumbers with predictable:true', function () {
    assert.ok(mathPredictable.log(math.bignumber(-1)).isNaN())
  })

  it('should return the log of a bignumber with value zero', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.log(bigmath.bignumber(0)).toString(), '-Infinity')
  })

  it('should return the log of a complex number', function () {
    approx.deepEqual(log(math.i), complex('1.570796326794897i'))
    approx.deepEqual(log(complex(0, -1)), complex('-1.570796326794897i'))
    approx.deepEqual(log(complex(1, 1)), complex('0.346573590279973 + 0.785398163397448i'))
    approx.deepEqual(log(complex(1, -1)), complex('0.346573590279973 - 0.785398163397448i'))
    approx.deepEqual(log(complex(-1, -1)), complex('0.346573590279973 - 2.356194490192345i'))
    approx.deepEqual(log(complex(-1, 1)), complex('0.346573590279973 + 2.356194490192345i'))
    approx.deepEqual(log(complex(1, 0)), complex(0, 0))
  })

  it('should handle complex number with large imaginary part', function () {
    const tau4 = math.tau / 4
    const real = [0, -1, 1]
    const imaginary = [1e15, 1e17, 1e20, 1e30]
    for (const r of real) {
      for (const im of imaginary) {
        approx.deepEqual(log(complex(r, im)), complex(Math.log(im), tau4))
      }
    }
  })

  it('should throw an error when used on a unit', function () {
    assert.throws(function () { log(unit('5cm')) })
  })

  it('should throw an error when used on a string', function () {
    assert.throws(function () { log('text') })
  })

  it('should return the log of each element of a matrix', function () {
    const res = [0, 0.693147180559945, 1.098612288668110, 1.386294361119891]
    approx.deepEqual(log([1, 2, 3, 4]), res)
    approx.deepEqual(log(matrix([1, 2, 3, 4])), matrix(res))
    approx.deepEqual(log(matrix([[1, 2], [3, 4]])),
      matrix([[0, 0.693147180559945], [1.098612288668110, 1.386294361119891]]))
  })

  it('should LaTeX log', function () {
    const expr1 = math.parse('log(e)')
    const expr2 = math.parse('log(32,2)')

    assert.strictEqual(expr1.toTex(), '\\ln\\left( e\\right)')
    assert.strictEqual(expr2.toTex(), '\\log_{2}\\left(32\\right)')
  })
})
