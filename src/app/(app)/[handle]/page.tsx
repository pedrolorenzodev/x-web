import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProfile } from "@/features/profile/api/get-profile";
import { getProfileTweets } from "@/features/profile/api/get-profile-tweets";

async function Profile({ params }: { params: PageProps<"/[handle]">["params"] }) {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile) notFound();

  const posts = await getProfileTweets(handle, "posts");

  return (
    <section>
      <h1>{profile.displayName}</h1>
      <p>@{profile.handle}</p>
      <p>{profile.bio}</p>
      <p>
        {profile.followingCount} following · {profile.followersCount} followers
      </p>
      <ul>
        {posts.items.map(({ tweet }) => (
          <li key={tweet.id}>{tweet.text}</li>
        ))}
      </ul>
    </section>
  );
}

export default function ProfilePage({ params }: PageProps<"/[handle]">) {
  return (
    <Suspense fallback={null}>
      <Profile params={params} />
    </Suspense>
  );
}
