import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { cookies } from "next/headers"
import { AuthButtonServer } from "./authButtonServer"
import { redirect } from "next/navigation"
import CreateTweet from "./CreateTweet"
import Likes from "./likes"
import { Profile } from "./global"
import Tweets from "./tweets"

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id, tweet_id )")
    .order("created_at", { ascending: false })

  const likedTweetIds: { [key: string]: boolean } | undefined = data
    ?.flatMap((tweet) => tweet.likes)
    .filter((like) => like.user_id === session.user.id)
    .reduce((acc, like) => ({ ...acc, [like.tweet_id]: true }), {})

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author)
        ? (tweet.author[0] as Profile)
        : (tweet.author as Profile),
      user_has_liked_tweet: !!likedTweetIds?.[tweet.id],
      likes: tweet.likes.length,
    })) ?? []

  return (
    <div className="self-stretch">
      <div className="flex justify-between border border-t-0 border-gray-200 px-4 py-6 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-700 dark:text-inherit">
          Home
        </h1>
        <AuthButtonServer />
      </div>
      <CreateTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  )
}
