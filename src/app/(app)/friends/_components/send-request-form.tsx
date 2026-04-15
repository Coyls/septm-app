"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useSendFriendRequest } from "@/lib/query/hooks/useFriends";
import {
  sendFriendRequestSchema,
  type SendFriendRequestSchema,
} from "@/lib/schemas/friends.schema";
import { AppError } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function SendRequestForm() {
  const { mutate: sendRequest, isPending } = useSendFriendRequest();
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
  );
}
