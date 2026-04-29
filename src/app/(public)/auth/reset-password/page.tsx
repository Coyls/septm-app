"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/lib/query/hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { AppError } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Trophy, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(data: ResetPasswordSchema) {
    setError(null);
    resetPassword(
      { token, password: data.password },
      {
        onError: (err) => {
          if (err instanceof AppError && err.status === 429) return;
          setError(
            "Le lien est invalide ou a expiré. Veuillez faire une nouvelle demande.",
          );
        },
      },
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 text-center pt-6">
          <XCircle className="h-10 w-10 text-destructive" />
          <p className="font-medium">Lien invalide</p>
          <Link
            href="/auth/forgot-password"
            className={buttonVariants({ className: "w-full" })}
          >
            Faire une nouvelle demande
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SEPTM</span>
        </div>
        <CardTitle>Nouveau mot de passe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="8 caractères minimum"
                        autoComplete="new-password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer le mot de passe"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
