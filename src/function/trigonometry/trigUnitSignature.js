import { factory } from '../../utils/factory.js'

const name = 'trigUnitSignature'
const dependencies = ['typed']

export const createTrigUnitSignature = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => ({
  Unit: typed.referToSelf(self => u => {
    if (!u.hasBase(u.constructor.BASE_UNITS.ANGLE)) {
      throw new TypeError(
        'A Unit argument to ' + self.name + ' must be an angle.')
    }
    return self(u.value)
  })
}))
