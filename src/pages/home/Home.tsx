import { Heading } from "@/components/ui/heading"
import { useUser } from "@/contexts/UserContext"

export default function Home() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <Heading>
          Bem-vindo, {user?.name}!
        </Heading>
      </div>
    </div>
  )
} 