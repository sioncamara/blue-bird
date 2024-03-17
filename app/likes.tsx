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
    <button onClick={handleLikes} className="group mt-3 flex items-center">
      <span
        className="flex items-center justify-center rounded-full group-hover:bg-pink-50 group-hover:ring-8 group-hover:ring-pink-50 group-active:bg-pink-100 group-active:ring-pink-100 
      dark:group-hover:bg-[#270c14] dark:group-hover:ring-[#270c14] dark:group-active:bg-pink-950 dark:group-active:ring-pink-950
      "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`   ${
            tweet.user_has_liked_tweet
              ? "fill-pink-600 stroke-pink-600"
              : "fill-none stroke-gray-500 group-hover:stroke-pink-600 "
          }`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </span>

      <span
        className={` ml-1 text-sm ${
          tweet.user_has_liked_tweet
            ? "text-pink-600"
            : "text-gray-500 group-hover:text-pink-600"
        }`}
      >
        {tweet.likes}
      </span>
    </button>
  )
}
