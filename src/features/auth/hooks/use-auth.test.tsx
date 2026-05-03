import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from './use-auth'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

beforeEach(() => localStorage.clear())

describe('useAuth', () => {
  it('começa não autenticado quando localStorage vazio', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('detecta token existente no mount', () => {
    localStorage.setItem('token', 'existing-token')
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('login() salva token no localStorage e autentica', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => { result.current.login('new-token') })
    expect(localStorage.getItem('token')).toBe('new-token')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('logout() remove token do localStorage', () => {
    localStorage.setItem('token', 'existing-token')
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => { result.current.logout() })
    expect(localStorage.getItem('token')).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('checkAuth() retorna true quando token existe', () => {
    localStorage.setItem('token', 'tok')
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.checkAuth()).toBe(true)
  })

  it('checkAuth() retorna false quando sem token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.checkAuth()).toBe(false)
  })
})
