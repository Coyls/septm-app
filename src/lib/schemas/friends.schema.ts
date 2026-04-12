import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  receiverId: z.string().min(1, "ID utilisateur requis"),
});

export type SendFriendRequestSchema = z.infer<typeof sendFriendRequestSchema>;
