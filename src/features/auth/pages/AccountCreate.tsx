import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useCreateTenantAndLogin } from "@/features/auth/hooks/use-create-tenant-and-login"
import { accountCreateSchema, TypeAccountCreateForm } from "@/features/auth/schemas/account-create"
import { formatCNPJ, formatCPF, formatPhone } from "@/lib/masks"

export default function AccountCreate() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: createTenantAndLogin, isPending } = useCreateTenantAndLogin()

  const form = useForm<TypeAccountCreateForm>({
    resolver: zodResolver(accountCreateSchema),
    defaultValues: {
      companyName: "",
      companyCnpj: "",
      ownerName: "",
      ownerPhone: "",
      ownerCpf: "",
      ownerPassword: "",
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const companyCnpj = watch("companyCnpj")
  const ownerPhone = watch("ownerPhone")
  const ownerCpf = watch("ownerCpf")

  const onSubmit = (data: TypeAccountCreateForm) => {
    createTenantAndLogin(data, {
      onSuccess: ({ token }) => {
        login(token)
        navigate("/home")
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Conta</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa</Label>
            <Input id="companyName" {...register("companyName")} placeholder="Nome da sua empresa" disabled={isPending} />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCnpj">CNPJ da empresa (opcional)</Label>
            <Input
              id="companyCnpj"
              value={companyCnpj}
              onChange={e => setValue("companyCnpj", formatCNPJ(e.target.value), { shouldValidate: true })}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              disabled={isPending}
            />
            {errors.companyCnpj && <p className="text-sm text-red-500">{errors.companyCnpj.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do proprietário</Label>
            <Input id="ownerName" {...register("ownerName")} placeholder="Seu nome completo" disabled={isPending} />
            {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Telefone</Label>
            <Input
              id="ownerPhone"
              value={ownerPhone}
              onChange={e => setValue("ownerPhone", formatPhone(e.target.value), { shouldValidate: true })}
              placeholder="(00) 00000-0000"
              maxLength={15}
              disabled={isPending}
            />
            {errors.ownerPhone && <p className="text-sm text-red-500">{errors.ownerPhone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerCpf">CPF</Label>
            <Input
              id="ownerCpf"
              value={ownerCpf}
              onChange={e => setValue("ownerCpf", formatCPF(e.target.value), { shouldValidate: true })}
              placeholder="000.000.000-00"
              maxLength={14}
              disabled={isPending}
            />
            {errors.ownerCpf && <p className="text-sm text-red-500">{errors.ownerCpf.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPassword">Senha</Label>
            <div className="relative">
              <Input
                id="ownerPassword"
                type={showPassword ? "text" : "password"}
                {...register("ownerPassword")}
                placeholder="Digite sua senha"
                disabled={isPending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(prev => !prev)}
                disabled={isPending}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.ownerPassword && <p className="text-sm text-red-500">{errors.ownerPassword.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
