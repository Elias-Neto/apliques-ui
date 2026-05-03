import '@testing-library/jest-dom'
import { server } from './msw/server'

// Radix UI usa pointer events e scroll APIs que jsdom não implementa
Element.prototype.hasPointerCapture = () => false
Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}
Element.prototype.scrollIntoView = () => {}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
