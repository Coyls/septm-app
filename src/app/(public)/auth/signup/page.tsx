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
import { useSignUp } from "@/lib/query/hooks/useAuth";
import { signUpSchema, type SignUpSchema } from "@/lib/schemas/auth.schema";
import { AppError } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signUp, isPending } = useSignUp();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(data: SignUpSchema) {
    setError(null);
    signUp(
      { name: data.name, email: data.email, password: data.password },
      {
        onError: (err) => {
          if (err instanceof AppError && err.status === 429) return;
          setError("Une erreur est survenue. Veuillez réessayer.");
        },
      },
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SEPTM</span>
        </div>
        <CardTitle>Inscription</CardTitle>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prénom ou pseudo"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
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
              {isPending ? "Inscription…" : "S'inscrire"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            href="/auth/signin"
            className="text-primary hover:underline font-medium"
          >
            Se connecter
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          En vous inscrivant, vous acceptez nos{" "}
          <Link href="/terms" className="hover:underline">
            conditions d&apos;utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
