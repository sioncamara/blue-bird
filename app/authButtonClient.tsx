"use client"
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export function AuthButtonClient<Database>({
  session,
}: {
  session: Session | null
}) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    router.refresh()
  }

  return session ? (
    <button className="text-xs text-gray-400" onClick={signOut}>
      Logout
    </button>
  ) : (
    <button className="text-xs text-gray-400" onClick={signInWithGithub}>
      Login
    </button>
  )
}
