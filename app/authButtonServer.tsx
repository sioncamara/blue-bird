import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AuthButtonClient } from "./authButtonClient"

export const dynamic = "force-dynamic"

export async function AuthButtonServer() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <AuthButtonClient session={session} />
}
