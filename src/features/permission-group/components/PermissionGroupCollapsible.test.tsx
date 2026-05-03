import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PermissionGroupCollapsible } from './PermissionGroupCollapsible'

const PERMISSIONS = [
  { groupId: 'group-1', groupLabel: 'Operador', permission: 'management.people.list', label: 'Listar', active: true },
  { groupId: 'group-1', groupLabel: 'Operador', permission: 'management.people.create', label: 'Criar', active: false },
]

describe('PermissionGroupCollapsible', () => {
  it('começa colapsado por padrão e exibe o label do contexto', () => {
    render(
      <PermissionGroupCollapsible
        contextLabel="Pessoas"
        permissions={PERMISSIONS}
        getPermissionValue={(_gId, _pId, orig) => orig}
        onPermissionToggle={vi.fn()}
      />
    )
    expect(screen.getByText('Pessoas')).toBeInTheDocument()
    // Conteúdo está no DOM mas escondido via max-h-0 (Tailwind não é computado no jsdom)
    const collapsibleContent = screen.getByText('Listar').closest('.overflow-hidden')
    expect(collapsibleContent).toHaveClass('max-h-0')
  })

  it('expande ao clicar no header', async () => {
    const user = userEvent.setup()
    render(
      <PermissionGroupCollapsible
        contextLabel="Pessoas"
        permissions={PERMISSIONS}
        getPermissionValue={(_gId, _pId, orig) => orig}
        onPermissionToggle={vi.fn()}
      />
    )
    await user.click(screen.getByText('Pessoas'))
    const collapsibleContent = screen.getByText('Listar').closest('.overflow-hidden')
    expect(collapsibleContent).not.toHaveClass('max-h-0')
  })

  it('chama onPermissionToggle ao alternar switch', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <PermissionGroupCollapsible
        contextLabel="Pessoas"
        permissions={PERMISSIONS}
        getPermissionValue={(_gId, _pId, orig) => orig}
        onPermissionToggle={onToggle}
        defaultExpanded
      />
    )
    await user.click(screen.getByRole('switch', { name: /listar/i }))
    expect(onToggle).toHaveBeenCalledWith('group-1', 'management.people.list', true)
  })

  it('começa expandido quando defaultExpanded=true', () => {
    render(
      <PermissionGroupCollapsible
        contextLabel="Pessoas"
        permissions={PERMISSIONS}
        getPermissionValue={(_gId, _pId, orig) => orig}
        onPermissionToggle={vi.fn()}
        defaultExpanded
      />
    )
    const collapsibleContent = screen.getByText('Listar').closest('.overflow-hidden')
    expect(collapsibleContent).not.toHaveClass('max-h-0')
  })
})
