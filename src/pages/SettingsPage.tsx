import { useState, type ChangeEvent } from "react";
import { Navigate } from "react-router-dom";

import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/lib/usePageTitle";

// mirrors the server-side limit
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export function SettingsPage() {
  usePageTitle("Settings");

  const { player, isLoading, refreshAvatar } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (isLoading) {
    return null;
  }
  if (!player) {
    return <Navigate to="/login" replace />;
  }

  function onSelectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    setUploaded(false);

    if (!file) {
      return;
    }
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Avatars must be png or jpeg images.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setError("Avatar file too large (max 2MB).");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onUpload() {
    if (!player || !selectedFile) {
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      await api.uploadAvatar(player.id, selectedFile);
      refreshAvatar();
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setUploaded(true);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage how your profile looks to other players."
      />

      <Card>
        <h2 className="font-semibold">Avatar</h2>
        <p className="mt-1 text-sm text-muted">
          Shown on your profile and next to your scores. PNG or JPEG, up
          to 2MB — if a JPEG is rejected, try saving it as PNG.
        </p>

        <div className="mt-5 flex items-center gap-5">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="New avatar preview"
              className="h-20 w-20 rounded-2xl bg-surface-2 object-cover"
            />
          ) : (
            <Avatar
              playerId={player.id}
              className="h-20 w-20 rounded-2xl bg-surface-2 object-cover"
            />
          )}

          <div className="space-y-2">
            <label className="inline-block cursor-pointer rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-3">
              Choose image
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={onSelectFile}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                type="button"
                onClick={onUpload}
                disabled={isUploading}
                className="ml-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            )}

            {error && <p className="text-sm text-red-300">{error}</p>}
            {uploaded && !error && (
              <p className="text-sm text-emerald-300">
                Avatar updated! It can take a moment to show everywhere.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
