import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import type { PointTypeId } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSafeRedirect(value: string | null): value is string {
  if (!value) return false;
  // Only allow relative paths — block absolute URLs and protocol-relative URLs (//)
  return value.startsWith("/") && !value.startsWith("//");
}

export function formatDate(isoString: string): string {
  return format(new Date(isoString), "d MMM yyyy", { locale: fr });
}

export function formatScore(n: number): string {
  return n.toLocaleString("fr-FR");
}

export function formatWinRate(n: number): string {
  return n.toFixed(1) + " %";
}

export function formatCoinsToPoints(coins: number): number {
  return Math.floor(coins / 3);
}

export function calculatePlayerTotal(
  coins: number,
  points: Record<PointTypeId, number> | number[],
): number {
  const pointsSum = Array.isArray(points)
    ? points.reduce((a, b) => a + b, 0)
    : Object.values(points).reduce((a: number, b) => a + (b as number), 0);
  return pointsSum + formatCoinsToPoints(coins);
}

const ERROR_MESSAGES: Record<string, string> = {
  NOT_ENOUGHT_PLAYERS: "Il faut au minimum 3 joueurs",
  GAME_NOT_FOUND: "Partie introuvable",
  FORBIDDEN: "Vous n'êtes pas autorisé à effectuer cette action",
  INVALID_GAME_STATUS: "Le statut de cette partie ne permet pas cette action",
  DUPLICATE_PLAYER_IN_PAYLOAD:
    "Un joueur apparaît plusieurs fois dans les scores",
  PLAYER_NOT_IN_GAME: "Joueur non trouvé dans cette partie",
  MISSING_PLAYER_SCORE: "Tous les joueurs doivent avoir un score",
  POINT_TYPE_NOT_ALLOWED: "Type de point non autorisé pour cette configuration",
  INVALID_DATE_RANGE: "La date de début doit être avant la date de fin",
  CANNOT_SEND_TO_SELF: "Vous ne pouvez pas vous inviter vous-même",
  RECEIVER_NOT_FOUND: "Utilisateur introuvable",
  ALREADY_FRIENDS: "Vous êtes déjà amis",
  REQUEST_ALREADY_EXISTS: "Demande déjà envoyée ou existante",
  INCOMING_REQUEST_ALREADY_EXISTS:
    "Cet utilisateur vous a déjà envoyé une demande",
  PENDING_REQUEST_NOT_FOUND: "Demande introuvable ou déjà traitée",
  FRIENDSHIP_NOT_FOUND: "Relation d'amitié introuvable",
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "Une erreur est survenue. Veuillez réessayer.";
}
