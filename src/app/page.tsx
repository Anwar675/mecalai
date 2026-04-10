
import { ButtonAuth } from "@/hook/useAuth"
import { auth } from "@/lib/auth"

import { headers } from "next/headers"
import { redirect } from "next/navigation"


const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session) {
    redirect("/sign-in")
  }
  return (
    <div>
      <h1>Dcm ${session?.user.name}</h1>
      <ButtonAuth />
    </div>
  )
}

export default Page