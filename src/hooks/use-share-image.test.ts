import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useShareImage } from './use-share-image'

const { toastMock } = vi.hoisted(() => ({ toastMock: vi.fn() }))
vi.mock('@/hooks/toast/use-toast', () => ({ useToast: () => ({ toast: toastMock }) }))

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,fake'),
}))

const fakeBlob = new Blob(['fake'], { type: 'image/png' })

const stubShare = (share?: unknown, canShare?: unknown) => {
  Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true })
  Object.defineProperty(navigator, 'canShare', { value: canShare, configurable: true, writable: true })
}

const makeRef = () => ({ current: document.createElement('div') })

beforeEach(() => {
  toastMock.mockClear()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ blob: () => Promise.resolve(fakeBlob) }))
  URL.createObjectURL = vi.fn().mockReturnValue('blob:fake')
  URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  // @ts-expect-error limpa polyfill de teste
  delete navigator.share
  // @ts-expect-error limpa polyfill de teste
  delete navigator.canShare
})

describe('useShareImage', () => {
  it('usa Web Share API quando o navegador suporta', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    stubShare(shareMock, () => true)

    const { result } = renderHook(() => useShareImage(makeRef(), 'notinha.png'))
    await act(async () => { await result.current.share() })

    expect(shareMock).toHaveBeenCalledTimes(1)
  })

  it('cai pra download quando navegador não suporta Web Share API', async () => {
    stubShare(undefined, undefined)

    const { result } = renderHook(() => useShareImage(makeRef(), 'notinha.png'))
    await act(async () => { await result.current.share() })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('download() sempre baixa, mesmo com Web Share API disponível', async () => {
    stubShare(vi.fn(), () => true)

    const { result } = renderHook(() => useShareImage(makeRef(), 'notinha.png'))
    await act(async () => { await result.current.download() })

    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('não lança quando o ref ainda não está montado', async () => {
    const emptyRef = { current: null }
    const { result } = renderHook(() => useShareImage(emptyRef, 'notinha.png'))
    await act(async () => { await result.current.share() })
    expect(result.current.isProcessing).toBe(false)
  })

  it('desistir de enviar (AbortError) não mostra erro', async () => {
    const abort = new DOMException('Share canceled', 'AbortError')
    stubShare(vi.fn().mockRejectedValue(abort), () => true)

    const { result } = renderHook(() => useShareImage(makeRef(), 'notinha.png'))
    await act(async () => { await result.current.share() })

    expect(toastMock).not.toHaveBeenCalled()
    expect(result.current.isProcessing).toBe(false)
  })

  it('falha real ao compartilhar continua mostrando erro', async () => {
    stubShare(vi.fn().mockRejectedValue(new Error('boom')), () => true)

    const { result } = renderHook(() => useShareImage(makeRef(), 'notinha.png'))
    await act(async () => { await result.current.share() })

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: 'Erro ao gerar imagem' }))
  })
})
