"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useAcceptRequest,
  useReceivedRequests,
  useRejectRequest,
} from "@/lib/query/hooks/useFriends";
import { ReceivedRequestCard } from "./received-request-card";

export function ReceivedTab() {
  const { data: received, isLoading } = useReceivedRequests();
  const { mutate: accept, isPending: accepting } = useAcceptRequest();
  const { mutate: reject, isPending: rejecting } = useRejectRequest();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!received?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Aucune demande en attente.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {received.map((req) => (
        <ReceivedRequestCard
          key={req.senderId}
          request={req}
          accept={accept}
          reject={reject}
          disabled={accepting || rejecting}
        />
      ))}
    </div>
  );
}
