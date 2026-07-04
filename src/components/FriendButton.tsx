import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";

/**
 * Add/remove-friend toggle shown on other players' profiles.
 * Renders nothing for anonymous visitors or on your own profile.
 */
export function FriendButton({ playerId }: { playerId: number }) {
  const { player: me } = useAuth();
  const queryClient = useQueryClient();

  const enabled = me !== null && me.id !== playerId;
  const friendsQuery = useQuery({
    queryKey: ["friends", me?.id],
    queryFn: () => api.fetchFriends(me!.id),
    enabled,
    select: (envelope) => envelope.data,
  });

  const isFriend =
    friendsQuery.data?.some((friend) => friend.id === playerId) ?? false;

  const mutation = useMutation({
    mutationFn: () =>
      isFriend
        ? api.removeFriend(me!.id, playerId)
        : api.addFriend(me!.id, playerId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["friends", me?.id] }),
  });

  if (!enabled || !friendsQuery.isSuccess) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isFriend
          ? "border border-line bg-surface-2 hover:bg-surface-3"
          : "bg-accent text-white hover:bg-accent-hover"
      }`}
    >
      {isFriend ? "✓ Friends" : "+ Add friend"}
    </button>
  );
}
