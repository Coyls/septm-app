"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { useForgotPassword } from "@/lib/query/hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { AppError } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: ForgotPasswordSchema) {
    setError(null);
    forgotPassword(data.email, {
      onSuccess: () => setSubmitted(true),
      onError: (err) => {
        if (err instanceof AppError && err.status === 429) return;
        setError("Une erreur est survenue. Veuillez réessayer.");
      },
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SEPTM</span>
        </div>
        <CardTitle>Mot de passe oublié</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 text-center py-2">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="font-medium">Email envoyé</p>
            <p className="text-sm text-muted-foreground">
              Si un compte existe avec cette adresse, vous recevrez un lien de
              réinitialisation dans quelques minutes.
            </p>
            <Link
              href="/auth/signin"
              className="text-sm text-primary hover:underline font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground">
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Envoi…" : "Envoyer le lien"}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/auth/signin"
                className="text-primary hover:underline font-medium"
              >
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
