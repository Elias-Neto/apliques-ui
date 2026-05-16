import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useCreateSession } from "@/features/auth/hooks/use-create-session"
import { loginSchema, TypeLoginForm } from "@/features/auth/schemas/login"
import { formatCPF } from "@/lib/masks"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { mutate: createSession, isPending } = useCreateSession()

  const form = useForm<TypeLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cpf: "", password: "" },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const cpf = watch("cpf")

  const onSubmit = (data: TypeLoginForm) => {
    createSession(data, {
      onSuccess: ({ token }) => {
        login(token)
        navigate("/home")
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Entre na sua conta</h1>
            <p className="text-gray-600">Digite suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={e => setValue("cpf", formatCPF(e.target.value), { shouldValidate: true })}
                disabled={isPending}
              />
              {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                {...register("password")}
                disabled={isPending}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login
