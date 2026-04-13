import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Nom requis"),
    email: z.email("Email invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
