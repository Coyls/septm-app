"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SafeUser } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FriendAvatar } from "./friend-avatar";

export const FriendCard = ({
  friend,
  createdAt,
  removing,
  remove,
}: {
  friend: SafeUser;
  createdAt: string;
  removing: boolean;
  remove: (friendId: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <FriendAvatar name={friend.name} image={friend.image} />
        <div>
          <p className="text-sm font-medium">{friend.name ?? friend.email}</p>
          <p className="text-xs text-muted-foreground">
            Amis depuis {formatDate(createdAt)}
          </p>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline" size="sm" disabled={removing} />}
        >
          Retirer
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer cet ami ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera votre relation d&apos;amitié avec{" "}
              <strong>{friend.name ?? friend.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove(friend.id)}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
