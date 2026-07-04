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

  if (!enabled) {
    return null;
  }

  // fixed footprint: the loading placeholder and both toggle states are
  // the same size, so neighbouring header content never shifts
  if (!friendsQuery.isSuccess) {
    return <span aria-hidden className="h-[34px] w-32 rounded-lg bg-surface-2" />;
  }

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`h-[34px] w-32 rounded-lg text-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
        isFriend
          ? "border border-line bg-surface-2 hover:bg-surface-3"
          : "bg-accent text-white hover:bg-accent-hover"
      }`}
    >
      {isFriend ? "✓ Friends" : "+ Add friend"}
    </button>
  );
}
