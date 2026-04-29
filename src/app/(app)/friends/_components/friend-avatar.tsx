import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function FriendAvatar({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const initial = name ? name.slice(0, 1).toUpperCase() : "?";
  return (
    <Avatar className="h-8 w-8">
      {image && <AvatarFallback />}
      <AvatarFallback className="text-xs">{initial}</AvatarFallback>
    </Avatar>
  );
}
