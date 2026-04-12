import { z } from "zod";

export const wizardPlayerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  wonderId: z.string().min(1, "Choisissez une merveille"),
  wonderSide: z.enum(["A", "B"]),
});

export type WizardPlayerSchema = z.infer<typeof wizardPlayerSchema>;
