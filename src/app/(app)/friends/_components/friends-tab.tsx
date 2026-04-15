"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFriends, useRemoveFriend } from "@/lib/query/hooks/useFriends";
import { FriendCard } from "./friend-card";

export function FriendsTab() {
  const { data: friends, isLoading } = useFriends();
  const { mutate: remove, isPending: removing } = useRemoveFriend();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Vous n&apos;avez pas encore d&apos;amis.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map(({ friend, createdAt }) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          createdAt={createdAt}
          removing={removing}
          remove={remove}
        />
      ))}
    </div>
  );
}
