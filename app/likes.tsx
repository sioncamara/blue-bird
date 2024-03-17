"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithInfo
  addOptimisticTweet: (newTweet: TweetWithInfo) => void
}) {
  const router = useRouter()

  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      startTransition(() => {
        if (tweet.user_has_liked_tweet) {
          addOptimisticTweet({
            ...tweet,
            likes: tweet.likes - 1,
            user_has_liked_tweet: !tweet.user_has_liked_tweet,
          })
        } else {
          addOptimisticTweet({
            ...tweet,
            likes: tweet.likes + 1,
            user_has_liked_tweet: !tweet.user_has_liked_tweet,
          })
        }
      })
      if (tweet.user_has_liked_tweet) {
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id })
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id })
      }
    }
    router.refresh()
  }
  return (
    <button onClick={handleLikes} className="group flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={` ring-offset-1 group-hover:rounded-full group-hover:bg-rose-50 group-hover:ring-8 group-hover:ring-rose-50 group-active:bg-rose-100  ${
          tweet.user_has_liked_tweet
            ? "fill-rose-600 stroke-rose-600"
            : "fill-none stroke-gray-500 group-hover:stroke-rose-600 "
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span
        className={`ml-1 text-sm  ${
          tweet.user_has_liked_tweet
            ? "text-rose-600"
            : "text-gray-500 group-hover:text-rose-600"
        }`}
      >
        {tweet.likes}
      </span>
    </button>
  )
}
