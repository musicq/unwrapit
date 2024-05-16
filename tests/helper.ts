import {defineWrapConfig} from '../src'
import {WrapConfig} from '../src/config'

vi.mock('panicit', async () => {
  const mod = await vi.importActual('panicit')
  return {
    ...(mod as typeof import('panicit')),
    panic: vi.fn(),
  }
})

const defaultWrapConfig = {...WrapConfig}

function resetWrapConfig() {
  defineWrapConfig(defaultWrapConfig)
}

afterEach(() => {
  vi.resetAllMocks()
  resetWrapConfig()
})
