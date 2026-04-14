"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resendVerification, verifyEmail } from "@/lib/api/auth";
import { AppError } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, Trophy, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      const res = await verifyEmail(token);
      if (!res.success) throw new Error("invalid_token");
      return res;
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast.success("Email de confirmation renvoyé."),
    onError: (err) => {
      if (err instanceof AppError && err.status === 429) {
        toast.error(
          "Trop de tentatives. Veuillez patienter avant de réessayer.",
        );
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SEPTM</span>
        </div>
        <CardTitle>Vérification de l&apos;email</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        {isLoading && (
          <>
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Vérification en cours…</p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="font-medium">Votre email a bien été confirmé.</p>
            <Link
              href="/dashboard"
              className={buttonVariants({ className: "w-full" })}
            >
              Accéder au tableau de bord
            </Link>
          </>
        )}

        {(isError || !token) && (
          <>
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="font-medium">Le lien est invalide ou a expiré.</p>
            <Button
              className="w-full"
              onClick={() => resend()}
              disabled={isResending}
            >
              {isResending ? "Envoi…" : "Renvoyer l'email de confirmation"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
