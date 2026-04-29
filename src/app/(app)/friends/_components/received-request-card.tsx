import { Button } from "@/components/ui/button";
import { ReceivedRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FriendAvatar } from "./friend-avatar";

export function ReceivedRequestCard({
  request,
  accept,
  reject,
  disabled,
}: {
  request: ReceivedRequest;
  accept: (senderId: string) => void;
  reject: (senderId: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <FriendAvatar name={request.sender.name} image={request.sender.image} />
        <div>
          <p className="text-sm font-medium">
            {request.sender.name ?? request.sender.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(request.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => accept(request.senderId)}
          disabled={disabled}
        >
          Accepter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => reject(request.senderId)}
          disabled={disabled}
        >
          Refuser
        </Button>
      </div>
    </div>
  );
}
