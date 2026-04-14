"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAcceptRequest,
  useCancelRequest,
  useFriends,
  useReceivedRequests,
  useRejectRequest,
  useRemoveFriend,
  useSendFriendRequest,
  useSentRequests,
} from "@/lib/query/hooks/useFriends";
import {
  sendFriendRequestSchema,
  type SendFriendRequestSchema,
} from "@/lib/schemas/friends.schema";
import { AppError } from "@/lib/types";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

function FriendAvatar({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "?";
  return (
    <Avatar className="h-8 w-8">
      {image && <AvatarImage src={image} />}
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}

function FriendsTab() {
  const { data: friends, isLoading } = useFriends();
  const { mutate: remove, isPending: removing } = useRemoveFriend();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!friends?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Vous n&apos;avez pas encore d&apos;amis.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map(({ friend, createdAt }) => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3">
            <FriendAvatar name={friend.name} image={friend.image} />
            <div>
              <p className="text-sm font-medium">
                {friend.name ?? friend.email}
              </p>
              <p className="text-xs text-muted-foreground">
                Amis depuis {formatDate(createdAt)}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="outline" size="sm" disabled={removing} />
              }
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
      ))}
    </div>
  );
}

function ReceivedTab() {
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
        <div
          key={req.senderId}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3">
            <FriendAvatar name={req.sender.name} image={req.sender.image} />
            <div>
              <p className="text-sm font-medium">
                {req.sender.name ?? req.sender.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(req.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => accept(req.senderId)}
              disabled={accepting || rejecting}
            >
              Accepter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => reject(req.senderId)}
              disabled={accepting || rejecting}
            >
              Refuser
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InviteTab() {
  const { data: sent, isLoading: sentLoading } = useSentRequests();
  const { mutate: sendRequest, isPending } = useSendFriendRequest();
  const { mutate: cancel } = useCancelRequest();
  const [inlineError, setInlineError] = useState<string | null>(null);

  const form = useForm<SendFriendRequestSchema>({
    resolver: zodResolver(sendFriendRequestSchema),
    defaultValues: { receiverId: "" },
  });

  function onSubmit(data: SendFriendRequestSchema) {
    setInlineError(null);
    sendRequest(
      { receiverId: data.receiverId },
      {
        onSuccess: () => form.reset(),
        onError: (err) => {
          if (err instanceof AppError) {
            setInlineError(getErrorMessage(err.code));
          } else {
            setInlineError("Une erreur est survenue.");
          }
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      {/* Send request form */}
      <div>
        <h3 className="text-sm font-medium mb-3">Envoyer une demande</h3>
        {inlineError && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription>{inlineError}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">ID utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="ID de l'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Envoi…" : "Envoyer"}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground mt-2">
          L&apos;ID utilisateur est visible sur le tableau de bord de chaque
          membre.
        </p>
      </div>

      {/* Pending sent requests */}
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
                <div
                  key={req.receiverId}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <FriendAvatar
                      name={req.receiver.name}
                      image={req.receiver.image}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {req.receiver.name ?? req.receiver.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Envoyé le {formatDate(req.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancel(req.receiverId)}
                  >
                    Annuler
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FriendsPage() {
  const { data: received } = useReceivedRequests();
  const pendingCount = received?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Amis</h1>

      <Tabs defaultValue="friends">
        <TabsList className="w-full ">
          <TabsTrigger value="friends" className="flex-1 cursor-pointer">
            Mes amis
          </TabsTrigger>
          <TabsTrigger value="received" className="flex-1 gap-2 cursor-pointer">
            Demandes reçues
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invite" className="flex-1 cursor-pointer">
            Inviter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          <FriendsTab />
        </TabsContent>
        <TabsContent value="received" className="mt-4">
          <ReceivedTab />
        </TabsContent>
        <TabsContent value="invite" className="mt-4">
          <InviteTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
