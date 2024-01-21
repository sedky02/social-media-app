import { useUserContext } from "@/context/AuthContext"

function RootLayout() {
  const {user} = useUserContext()
  return (
    <div>RootLayout <h1>Welcome Back Mr {user.name}</h1>  </div>

  )
}

export default RootLayout