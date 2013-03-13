/**
 * Computes the principal value of the arc tangent of y/x in radians, atan2(y,x)
 * @param {Number | Complex | Array} y
 * @param {Number | Complex | Array} x
 * @return {Number | Complex | Array} res
 */
function atan2(y, x) {
    if (arguments.length != 2) {
        throw newArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y, x.re);
        }
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
    }

    if (x instanceof Array || y instanceof Array) {
        return util.map2(y, x, atan2);
    }
    // TODO: implement matrix support

    throw newUnsupportedTypeError('atan2', y, x);
}

math.atan2 = atan2;

/**
 * Function documentation
 */
atan2.doc = {
    'name': 'atan2',
    'category': 'Trigonometry',
    'syntax': [
        'atan2(y, x)'
    ],
    'description':
        'Computes the principal value of the arc tangent of y/x in radians.',
    'examples': [
        'atan2(2, 2) / pi',
        'angle = 60 deg in rad',
        'x = cos(angle)',
        'y = sin(angle)',
        'atan2(y, x)'
    ],
    'seealso': [
        'sin',
        'cos',
        'tan'
    ]
};
