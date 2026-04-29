import { Button } from "@/components/ui/button";
import { SentRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FriendAvatar } from "./friend-avatar";

export function PendingRequestCard({
  request,
  cancel,
}: {
  request: SentRequest;
  cancel: (receiverId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <FriendAvatar
          name={request.receiver.name}
          image={request.receiver.image}
        />
        <div>
          <p className="text-sm font-medium">
            {request.receiver.name ?? request.receiver.email}
          </p>
          <p className="text-xs text-muted-foreground">
            Envoyé le {formatDate(request.createdAt)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => cancel(request.receiverId)}
      >
        Annuler
      </Button>
    </div>
  );
}
