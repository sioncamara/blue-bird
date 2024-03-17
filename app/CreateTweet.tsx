import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import Image from "next/image"

export default function CreateTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server"
    const title = String(formData.get("title"))
    const supabase = createServerActionClient<Database>({ cookies })
    await supabase.from("tweets").insert({ title, user_id: user.id })
    // revalidatePath("/")
  }

  return (
    <form
      className="border border-t-0 border-gray-200 dark:border-gray-800"
      action={addTweet}
    >
      <div className="flex px-4 py-8">
        <Image
          src={user.user_metadata.avatar_url}
          alt="user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />

        <input
          name="title"
          className="ml-2 flex-1 bg-inherit px-2 text-2xl leading-loose placeholder-gray-500 focus:outline-none"
          placeholder="What is happening?!"
        />
      </div>
    </form>
  )
}
