import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";

/**
 * Favourite/unfavourite toggle for a beatmap set.
 * Renders nothing for anonymous visitors.
 */
export function FavouriteButton({ setId }: { setId: number }) {
  const { player: me } = useAuth();
  const queryClient = useQueryClient();

  const favouritesQuery = useQuery({
    queryKey: ["favourites", me?.id],
    queryFn: () => api.fetchFavourites(me!.id),
    enabled: me !== null,
    select: (envelope) => envelope.data,
  });

  const isFavourited = favouritesQuery.data?.includes(setId) ?? false;

  const mutation = useMutation({
    mutationFn: () =>
      isFavourited
        ? api.removeFavourite(me!.id, setId)
        : api.addFavourite(me!.id, setId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["favourites", me?.id] }),
  });

  if (me === null || !favouritesQuery.isSuccess) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      title={isFavourited ? "Remove from favourites" : "Add to favourites"}
      className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isFavourited
          ? "border-accent/40 bg-accent-soft text-accent hover:bg-accent/25"
          : "border-line bg-surface-2 hover:bg-surface-3"
      }`}
    >
      {isFavourited ? "♥ Favourited" : "♡ Favourite"}
    </button>
  );
}
