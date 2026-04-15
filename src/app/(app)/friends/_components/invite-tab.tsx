"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCancelRequest, useSentRequests } from "@/lib/query/hooks/useFriends";
import { PendingRequestCard } from "./pending-request-card";
import { SendRequestForm } from "./send-request-form";

export function InviteTab() {
  const { data: sent, isLoading: sentLoading } = useSentRequests();
  const { mutate: cancel } = useCancelRequest();

  return (
    <div className="space-y-6">
      <SendRequestForm />

      <div>
        <h3 className="text-sm font-medium mb-3">Demandes envoyées</h3>
        {sentLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : !sent?.filter((r) => r.status === "PENDING").length ? (
          <p className="text-sm text-muted-foreground">
            Aucune demande en attente.
          </p>
        ) : (
          <div className="space-y-2">
            {sent
              .filter((r) => r.status === "PENDING")
              .map((req) => (
                <PendingRequestCard
                  key={req.receiverId}
                  request={req}
                  cancel={cancel}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
