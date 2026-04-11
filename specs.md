# Frontend Specs — SEPTM (7 Wonders Score Tracker)

## Vue d'ensemble

Application web de suivi des scores pour le jeu de société **7 Wonders**. Les joueurs peuvent créer des parties, saisir les scores par catégorie, suivre leurs statistiques personnelles et globales, et gérer leurs amis.

---

## Stack technique

### Core
- **Framework** : Next.js 15 (App Router, React Server Components)
- **Langage** : TypeScript strict (`strict: true`)
- **Package manager** : pnpm

### UI & Styling
- **Styling** : Tailwind CSS v4
- **Composants** : shadcn/ui (Radix UI primitives) — accessibilité et composabilité
- **Icônes** : Lucide React
- **Thème** : Dark mode par défaut, avec support light mode via `next-themes`
- **Animations** : Tailwind CSS animate + `motion` (anciennement Framer Motion) pour les transitions de page et micro-interactions

### Data fetching & State
- **Server fetching** : fetch natif dans les Server Components (cache Next.js)
- **Client fetching** : TanStack Query v5 (React Query) — cache, invalidation, optimistic updates
- **Formulaires** : React Hook Form + Zod (validation client-side alignée avec les DTOs backend)
- **État global client** : Zustand (état wizard de création de partie uniquement)

### Sécurité
- **Auth** : Cookies HttpOnly gérés par le backend (JWT access + refresh)
- **CSRF** : Double-submit pattern via `csrf-csrf`. Token récupéré sur `GET /csrf`, envoyé dans l'en-tête `x-csrf-token` sur toutes les mutations
- **Route protection** : Next.js Middleware (`middleware.ts`) — redirect vers `/signin` si non authentifié
- **Headers de sécurité** : `next.config.ts` avec CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- **Validation** : Zod sur tous les formulaires, jamais de données brutes envoyées sans validation

### Charts & Visualisation
- **Recharts** — composant React natif, léger, compatible SSR

---

## Architecture des routes (App Router)

```
app/
├── (public)/                    # Layout sans authentification
│   ├── page.tsx                 # Landing page
│   ├── signin/page.tsx          # Connexion
│   └── signup/page.tsx          # Inscription
│
├── (app)/                       # Layout authentifié (vérifié côté middleware)
│   ├── layout.tsx               # Shell : sidebar + header
│   ├── dashboard/page.tsx       # Tableau de bord
│   ├── game/
│   │   ├── new/page.tsx         # Création d'une partie (wizard 3 étapes)
│   │   └── [gameId]/
│   │       └── score/page.tsx   # Saisie des scores
│   ├── statistics/
│   │   ├── page.tsx             # Statistiques globales
│   │   └── me/page.tsx          # Mes statistiques personnelles
│   └── friends/page.tsx         # Gestion des amis
│
└── not-found.tsx
```

---

## Sécurité — Détail d'implémentation

### Middleware Next.js
Fichier `middleware.ts` à la racine du projet.

- Appel à `GET /auth/me` depuis le middleware pour valider la session (cookies transmis via `credentials: 'include'`)
- Redirect `/signin?redirect=<url>` si `401`
- Redirect `/dashboard` si déjà authentifié et accès à `/signin` ou `/signup`
- Matcher : protéger toutes les routes sauf `/(public)`, `/_next`, `/favicon.ico`

### CSRF — Flux exact
Le backend utilise le pattern **double-submit** via la librairie `csrf-csrf` :

1. Au démarrage de l'app (dans un Provider React), appeler `GET /csrf`
2. Le backend retourne `{ csrfToken: string }` **et** pose un cookie `csrf` (HttpOnly)
3. Stocker le `csrfToken` en mémoire (Zustand ou Context), **jamais en localStorage**
4. Injecter `x-csrf-token: <token>` dans toutes les requêtes `POST`, `PATCH`, `DELETE`
5. Le backend vérifie que le cookie et le header correspondent

```ts
// Exemple d'intercepteur fetch
async function apiFetch(url: string, options: RequestInit = {}) {
  const csrfToken = useCsrfStore.getState().token;
  const method = options.method?.toUpperCase() ?? 'GET';
  const mutationMethods = ['POST', 'PATCH', 'DELETE', 'PUT'];

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(mutationMethods.includes(method) && csrfToken
        ? { 'x-csrf-token': csrfToken }
        : {}),
      ...options.headers,
    },
  });
}
```

### Refresh automatique des tokens
- Si une requête retourne `401`, tenter `POST /auth/refresh` automatiquement
- Si le refresh échoue → vider le cache TanStack Query + redirect `/signin`
- Implémenter via un wrapper `apiFetch` avec retry unique sur 401

### Credentials
- `credentials: 'include'` sur **toutes** les requêtes sans exception
- Aucune donnée sensible (email, mot de passe, token) dans `localStorage` ou `sessionStorage`

### Headers de sécurité `next.config.ts`
```ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL}`,
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];
```

---

## Référence des types — Enums

Ces valeurs sont exactement celles utilisées par le backend. Ne jamais les coder en dur côté front sans passer par les types ci-dessous.

```ts
type ExtensionId =
  | 'VANILLA'
  | 'LEADER'
  | 'CITIES'
  | 'ARMADA'
  | 'EDIFICE'
  | 'GRAND_PROJECT'
  | 'BABEL'
  | 'WONDER_PACK';

type WonderId =
  | 'OLYMPIA'
  | 'EPHESOS'
  | 'GIZAH'
  | 'BABYLON'
  | 'ALEXANDRIA'
  | 'HALIKARNASSOS'
  | 'RHODOS'
  | 'BYZANTIUM'
  | 'PETRA'
  | 'MANNEKEN_PIS'
  | 'ABU_SIMBEL'
  | 'STONEHENGE'
  | 'THE_GREAT_WALL'
  | 'ROMA'
  | 'UR'
  | 'CARTHAGE'
  | 'SIRACUSA';

type PointTypeId =
  | 'COIN'
  | 'WONDER'
  | 'LAND_WAR'
  | 'ARMADA_WAR'
  | 'COMMERCE'
  | 'CIVIL'
  | 'SCIENTIST'
  | 'GUILD'
  | 'LEADER'
  | 'CITIES'
  | 'ARMADA'
  | 'EDIFICE'
  | 'GRAND_PROJECT'
  | 'BABEL';

type Side = 'A' | 'B';
type GameStatus = 'STARTED' | 'FINISHED';
type FriendRequestStatus = 'PENDING' | 'ACCEPTED';
type RelationshipState = 'NONE' | 'FRIENDS' | 'REQUEST_SENT' | 'REQUEST_RECEIVED' | 'SELF';
```

### Mapping Extension → PointTypes disponibles
Les types de points sont liés aux extensions en base de données. Voici le mapping qui guide la saisie des scores :

| Extension      | PointTypeId activé                                     |
|----------------|--------------------------------------------------------|
| `VANILLA`      | `COIN`, `WONDER`, `LAND_WAR`, `COMMERCE`, `CIVIL`, `SCIENTIST`, `GUILD` |
| `LEADER`       | `LEADER`                                               |
| `CITIES`       | `CITIES`                                               |
| `ARMADA`       | `ARMADA_WAR`, `ARMADA`                                 |
| `EDIFICE`      | `EDIFICE`                                              |
| `GRAND_PROJECT`| `GRAND_PROJECT`                                        |
| `BABEL`        | `BABEL`                                                |
| `WONDER_PACK`  | *(aucun type de point supplémentaire)*                 |

> Note : `VANILLA` est toujours inclus. La liste réelle des types autorisés est retournée par `GET /game/options` et validée par le backend lors du `POST /game/:gameId/score`. Les PointTypes ont également un champ `color` (hex) et `order` qui peuvent être utilisés pour l'affichage.

---

## Référence des types — Interfaces API

### Utilisateur

```ts
// GET /auth/me → { user: AuthUser }
interface AuthUser {
  userId: string;
}

// Modèle complet utilisateur (retourné dans les listes d'amis, etc.)
interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null; // ISO date
  image: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### Auth

```ts
// POST /auth/signup — body
interface SignUpBody {
  email: string;      // email valide
  password: string;   // min 8 caractères
}
// → { userId: string }

// POST /auth/signin — body
interface SignInBody {
  email: string;
  password: string;
}
// → { userId: string }

// POST /auth/refresh — body : (vide, le refresh token est dans le cookie)
// → { success: true }

// POST /auth/refresh/signout — body : (vide)
// → true

// GET /csrf
// → { csrfToken: string }  + pose le cookie `csrf`
```

### Game

```ts
// GET /game/options
interface GameOptions {
  extensions: Array<{
    id: ExtensionId;
    name: string;
  }>;
  wonders: Array<{
    id: WonderId;
    name: string;
    extensionId: ExtensionId; // extension à laquelle appartient cette merveille
    sides: Array<{
      side: Side;
      requiredExtensions: ExtensionId[]; // extensions requises pour jouer cette face
    }>;
  }>;
}

// POST /game — body
interface CreateGameBody {
  extensionIds: ExtensionId[];  // sans VANILLA (ajouté automatiquement côté backend)
  players: Array<{
    userId?: string;      // optionnel : lier à un compte existant
    name: string;         // obligatoire
    email?: string;       // optionnel : email d'un joueur non inscrit
    wonderId: WonderId;   // obligatoire
    wonderSide: Side;     // obligatoire : 'A' | 'B'
  }>;
}
// → { id: string; slug: string; status: GameStatus; createdById: string; createdAt: string; updatedAt: string }
// Le champ `id` est l'identifiant à utiliser pour la route suivante

// POST /game/:gameId/score — body
interface UpsertGameScoreBody {
  players: Array<{
    playerId: string;  // id du joueur dans la partie (retourné lors du POST /game)
    coins: number;     // entier ≥ 0
    points: Array<{
      pointTypeId: PointTypeId;
      points: number;  // entier (peut être négatif pour certains types)
    }>;
  }>;
}
// → { id: string; status: 'FINISHED' }
```

> **Important** : Le `POST /game` ne retourne pas les `players` avec leurs IDs dans la réponse actuelle. Il faut stocker les IDs de joueurs lors de la création de partie (en les récupérant depuis le retour complet, ou en faisant un GET complémentaire). À implémenter selon la réponse réelle — vérifier avec le backend si un endpoint `GET /game/:gameId` doit être ajouté.

### Statistics

```ts
// GET /statistic/global?from=<ISO>&to=<ISO>
// GET /statistic/me?from=<ISO>&to=<ISO>
interface StatisticsResponse {
  totalFinishedGames: number;

  byPlayer: Array<{
    playerKey: string;       // "user:<userId>" ou "guest:<email|id>"
    userId: string | null;   // null si joueur invité
    label: string;           // nom affiché
    games: number;
    averageScore: number;
    winRate: number;         // pourcentage (0-100)
  }>;

  scoreDistribution: Array<{
    label: string;  // '<30' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'
    count: number;
  }>;

  pointTypeDistribution: Array<{
    pointTypeId: PointTypeId;
    totalPoints: number;
  }>;

  wonderPerformance: Array<{
    wonderId: WonderId;
    games: number;
    averageScore: number;
    winRate: number;
  }>;

  sidePerformance: Array<{
    side: Side;
    games: number;
    averageScore: number;
    winRate: number;
  }>;

  extensionImpact: Array<{
    extensionId: ExtensionId;
    games: number;
    averageScorePerPlayer: number;
    averageWinnerCount: number;
  }>;

  trendByMonth: Array<{
    month: string;        // format "YYYY-MM"
    games: number;
    averageScore: number;
  }>;

  competitiveness: {
    averageGap: number;
    distribution: Array<{
      label: string;  // '0' | '1-3' | '4-7' | '8-12' | '13+'
      count: number;
    }>;
  };
}
```

### Friends

```ts
// POST /friend-request/invite — body
interface SendFriendRequestBody {
  receiverId: string;  // ID de l'utilisateur cible (pas son email)
}
// → { senderId: string; receiverId: string; status: 'PENDING'; createdAt: string }

// GET /friend-request/received
type ReceivedRequestsResponse = Array<{
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
  sender: SafeUser;  // informations complètes de l'expéditeur
}>;

// GET /friend-request/sent
type SentRequestsResponse = Array<{
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
  receiver: SafeUser;  // informations complètes du destinataire
}>;

// GET /friend-request/friends
type FriendsResponse = Array<{
  createdAt: string;
  friend: SafeUser;  // l'ami (résolution de la paire canonique faite côté backend)
}>;

// GET /friend-request/status/:targetUserId
interface RelationshipStatusResponse {
  state: RelationshipState;
}

// PATCH /friend-request/:senderId/accept → { senderId; receiverId; status: 'ACCEPTED' }
// DELETE /friend-request/:senderId/reject → { senderId; receiverId }
// DELETE /friend-request/:receiverId/cancel → { senderId; receiverId }
// DELETE /friend-request/friends/:friendId → { success: true }
```

---

## Contrainte connue — Envoi de demande d'ami

Le backend attend un `receiverId` (ID utilisateur), **pas un email**. Il n'existe pas encore d'endpoint de recherche d'utilisateurs par email ou nom.

**Solution côté frontend** : sur la page `/friends`, implémenter un champ texte libre pour saisir l'ID utilisateur. Afficher l'ID de l'utilisateur connecté sur la page dashboard ou profil pour qu'il puisse le partager.

> Si un endpoint `GET /user/search?q=<email>` est ajouté au backend ultérieurement, remplacer le champ ID par une recherche autocomplete.

---

## Pages — Détail fonctionnel

### `/` — Landing page
**Public, non authentifié**

- Hero avec titre de l'app, description courte et CTA "Commencer" → `/signup`
- Présentation des fonctionnalités clés (score multi-extension, stats, amis)
- Lien vers `/signin`

---

### `/signin` — Connexion
**Public**

**Formulaire** :
- Email (`type="email"`)
- Mot de passe (`type="password"`, toggle visibilité)
- Bouton "Se connecter"
- Lien "Pas de compte ? S'inscrire" → `/signup`

**Schéma Zod** :
```ts
z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

**API** : `POST /auth/signin` → redirect `/dashboard` (ou `?redirect=` si défini)

**UX** :
- Message d'erreur générique "Email ou mot de passe incorrect" (ne pas distinguer les deux)
- Loading state sur le bouton
- Si réponse 429 : "Trop de tentatives, réessayez dans un moment"

---

### `/signup` — Inscription
**Public**

**Formulaire** :
- Email
- Mot de passe (min 8 caractères, indicateur de force : faible / moyen / fort)
- Confirmation du mot de passe
- Bouton "S'inscrire"

**Schéma Zod** :
```ts
z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})
```

**API** : `POST /auth/signup` → redirect `/dashboard`

---

### `/dashboard` — Tableau de bord
**Authentifié**

- Récupérer l'utilisateur : `GET /auth/me`
- Bouton CTA prominent : **"Nouvelle partie"** → `/game/new`
- Résumé rapide des stats perso : `GET /statistic/me` (games, winRate, averageScore)
- Section "Demandes d'amis en attente" avec compteur : `GET /friend-request/received`
- Afficher l'ID utilisateur (pour pouvoir le partager pour les demandes d'amis)

---

### `/game/new` — Création d'une partie
**Authentifié — wizard 3 étapes**

État du wizard stocké dans Zustand, persisté en `sessionStorage` pour survivre à un refresh accidentel.

**API à appeler au montage** : `GET /game/options` → stocker dans TanStack Query

#### Étape 1 : Extensions
- `VANILLA` : coché, désactivé (toujours inclus)
- Les autres extensions : checkboxes cliquables avec nom affiché
- Bouton "Suivant" → Étape 2

#### Étape 2 : Joueurs (min 3)
- Bouton "+ Ajouter un joueur" (pas de limite max explicite côté backend)
- Pour chaque joueur :
  - **Nom** (texte libre, `required`)
  - **Associer à un ami** (optionnel) : combobox filtrant `GET /friend-request/friends`. Si sélectionné, pré-remplit le nom et le `userId`
  - **Merveille** : sélecteur visuel. Filtrer les merveilles selon les extensions sélectionnées à l'étape 1 (utiliser `extensionId` de la merveille et `requiredExtensions` des faces). Une merveille ne peut pas être choisie par deux joueurs.
  - **Face** : toggle A / B. Si une face a des `requiredExtensions` non sélectionnées à l'étape 1, la désactiver avec un tooltip explicatif.
- Validation : ≥ 3 joueurs, pas de doublon de merveille
- Bouton "Précédent" / "Suivant"

#### Étape 3 : Confirmation
- Récapitulatif extensions + liste joueurs (nom, merveille, face)
- Bouton "Créer la partie"

**API** : `POST /game` avec :
```ts
{
  extensionIds: selectedExtensions.filter(id => id !== 'VANILLA'),
  players: players.map(p => ({
    userId: p.userId,    // optionnel
    name: p.name,
    wonderId: p.wonderId,
    wonderSide: p.side,
  }))
}
```
→ Stocker la réponse (notamment l'`id` de la partie et les IDs des joueurs si présents)
→ Redirect `/game/:id/score`

---

### `/game/[gameId]/score` — Saisie des scores
**Authentifié — seul le créateur peut soumettre**

L'état de la page (scores en cours de saisie) est géré localement en React state, pas en Zustand.

**Layout** : deux colonnes sur desktop
- Colonne gauche : cards de saisie par joueur
- Colonne droite : classement temps réel (se met à jour à chaque frappe)

**Par joueur** :
- Header : nom + merveille + face
- Champ "Pièces" (`coins`) : entier ≥ 0
- Un champ numérique par `PointTypeId` autorisé (selon les extensions de la partie)
  - Utiliser le `color` des PointTypes (retourné par `GET /game/options` ou à ajouter) pour colorer les labels
  - Utiliser l'`order` pour trier les champs
- Score total calculé : `sum(points) + floor(coins / 3)` *(les pièces valent 1 point par tranche de 3)*

> Note : la formule coins → points (`floor(coins / 3)`) est une règle du jeu 7 Wonders. À afficher clairement dans l'UI (ex: "12 pièces = 4 pts").

**Classement temps réel** :
- Trier les joueurs par score total décroissant
- Afficher 1er, 2ème, 3ème avec badge de médaille
- Mettre en évidence l'écart entre 1er et 2ème

**Soumission** :
- Bouton "Finaliser la partie" (disabled si tous les joueurs n'ont pas au moins `coins` renseigné)
- Modale de confirmation : "Cette action est irréversible"
- `POST /game/:gameId/score`
- Succès → redirect `/statistics/me` + toast "Partie enregistrée !"

---

### `/statistics` — Statistiques globales
**Authentifié**

**API** : `GET /statistic/global?from=<ISO>&to=<ISO>`

**Filtres de période** (date range picker) :
- "Cette semaine" / "Ce mois" / "Cette année" / "Tout" / "Personnalisé"
- Génère les paramètres `from` et `to` en ISO 8601

**Sections** (dans cet ordre) :
1. **KPI** : nombre total de parties finies (`totalFinishedGames`)
2. **Classement des joueurs** (`byPlayer`) : tableau trié par `winRate` desc, colonnes : Joueur | Parties | Score moyen | Winrate
3. **Tendance mensuelle** (`trendByMonth`) : line chart — axe X = mois, deux séries = nb parties + score moyen
4. **Distribution des scores** (`scoreDistribution`) : bar chart par bucket
5. **Performance par Merveille** (`wonderPerformance`) : tableau ou heatmap — tri par `winRate`
6. **Performance par Face** (`sidePerformance`) : bar chart A vs B (winRate + score moyen)
7. **Répartition des types de points** (`pointTypeDistribution`) : pie chart ou bar chart horizontal
8. **Impact des extensions** (`extensionImpact`) : tableau
9. **Compétitivité** (`competitiveness`) : bar chart de la distribution des écarts + affichage de l'écart moyen

---

### `/statistics/me` — Mes statistiques
**Authentifié**

Même structure que `/statistics` mais avec `GET /statistic/me`.

En plus :
- Mise en avant de la merveille la plus jouée (extraire de `wonderPerformance`)
- Mise en avant de la merveille avec le meilleur winRate

---

### `/friends` — Gestion des amis
**Authentifié**

**Tabs** (shadcn/ui Tabs) :

#### Tab "Mes amis" — `GET /friend-request/friends`
- Liste des amis (`friend.name ?? friend.email`, avatar via `friend.image` si disponible)
- Bouton "Retirer" → `DELETE /friend-request/friends/:friendId` + confirmation modale
- Optimistic update : retirer de la liste immédiatement, rollback si erreur

#### Tab "Demandes reçues" — `GET /friend-request/received`
- Badge avec compteur sur le tab si > 0 demandes
- Par demande : nom/email de l'expéditeur + date
- Bouton "Accepter" → `PATCH /friend-request/:senderId/accept`
- Bouton "Refuser" → `DELETE /friend-request/:senderId/reject`
- Optimistic update sur les deux actions

#### Tab "Inviter" — `GET /friend-request/sent`
- Champ texte : "ID de l'utilisateur" (voir contrainte connue ci-dessus)
- Bouton "Envoyer la demande" → `POST /friend-request/invite` avec `{ receiverId: string }`
- Erreurs à afficher explicitement :
  - `CANNOT_SEND_TO_SELF` : "Vous ne pouvez pas vous inviter vous-même"
  - `RECEIVER_NOT_FOUND` : "Utilisateur introuvable"
  - `ALREADY_FRIENDS` : "Vous êtes déjà amis"
  - `REQUEST_ALREADY_EXISTS` : "Demande déjà envoyée"
  - `INCOMING_REQUEST_ALREADY_EXISTS` : "Cet utilisateur vous a déjà envoyé une demande"
- Section "Demandes envoyées en attente" : liste + bouton "Annuler" → `DELETE /friend-request/:receiverId/cancel`

---

## Navigation & Layout

### Layout authentifié (`(app)/layout.tsx`)

**Sidebar (desktop, largeur fixe ~240px)** :
- Logo / nom de l'app en haut
- Liens de navigation :
  - Dashboard
  - Nouvelle partie *(CTA avec couleur accentuée)*
  - Statistiques globales
  - Mes statistiques
  - Amis *(badge rouge si demandes en attente)*
- Séparateur
- En bas : email de l'utilisateur tronqué + bouton "Déconnexion"

**Header (mobile)** : hamburger → Drawer latéral avec les mêmes liens

**Déconnexion** :
```ts
await apiFetch('/auth/refresh/signout', { method: 'POST' });
queryClient.clear();
zustandStore.reset();
router.push('/signin');
```

### Toasts (Sonner via shadcn/ui)
- Succès : création de partie, finalisation de score, actions amis
- Erreur : tous les cas d'erreur API non gérés inline

---

## Gestion des erreurs API

### Codes d'erreur → messages utilisateur

| Code backend                     | Message à afficher                                       |
|----------------------------------|----------------------------------------------------------|
| `NOT_ENOUGHT_PLAYERS`            | "Il faut au minimum 3 joueurs"                           |
| `GAME_NOT_FOUND`                 | "Partie introuvable"                                     |
| `FORBIDDEN`                      | "Vous n'êtes pas autorisé à effectuer cette action"      |
| `INVALID_GAME_STATUS`            | "Le statut de cette partie ne permet pas cette action"   |
| `DUPLICATE_PLAYER_IN_PAYLOAD`    | "Un joueur apparaît plusieurs fois dans les scores"      |
| `PLAYER_NOT_IN_GAME`             | "Joueur non trouvé dans cette partie"                    |
| `MISSING_PLAYER_SCORE`           | "Tous les joueurs doivent avoir un score"                |
| `POINT_TYPE_NOT_ALLOWED`         | "Type de point non autorisé pour cette configuration"    |
| `INVALID_DATE_RANGE`             | "La date de début doit être avant la date de fin"        |
| `CANNOT_SEND_TO_SELF`            | "Vous ne pouvez pas vous inviter vous-même"              |
| `RECEIVER_NOT_FOUND`             | "Utilisateur introuvable"                                |
| `ALREADY_FRIENDS`                | "Vous êtes déjà amis"                                    |
| `REQUEST_ALREADY_EXISTS`         | "Demande déjà envoyée ou existante"                      |
| `INCOMING_REQUEST_ALREADY_EXISTS`| "Cet utilisateur vous a déjà envoyé une demande"         |
| `PENDING_REQUEST_NOT_FOUND`      | "Demande introuvable ou déjà traitée"                    |
| `FRIENDSHIP_NOT_FOUND`           | "Relation d'amitié introuvable"                          |

### Format d'erreur backend
```ts
// Le backend retourne toujours ce format pour les erreurs
interface ApiError {
  statusCode: number;
  message: string | { code: string; message: string };
}
```

### 429 (Rate Limit)
Afficher : "Trop de tentatives. Veuillez patienter avant de réessayer."

### 500 / Erreur réseau
Afficher : "Une erreur est survenue. Veuillez réessayer." + bouton "Réessayer"

---

## UX & Design System

### Principes
- **Mobile-first** : responsive du 320px au 1440px
- **Dark mode par défaut** avec toggle persisté via `next-themes`
- **Accessibilité** : ARIA labels, keyboard navigation, `focus-visible` sur tous les interactifs, contraste WCAG AA
- **Loading states** : skeletons shadcn/ui sur les données async, jamais de contenu vide sans indicateur
- **Optimistic updates** : actions rapides amis mises à jour immédiatement dans le cache TanStack Query

### Palette de couleurs suggérée (dark mode base)
- Background principal : `#0a0a0a`
- Surface cards : `#111111`
- Accent principal : `#e6a817` *(or, évoque les pièces de 7 Wonders)*
- Texte principal : `#fafafa`
- Texte secondaire : `#a1a1aa`
- Succès : `#22c55e`
- Erreur : `#ef4444`
- Bordures : `#27272a`

### Composants clés à construire
- `WonderCard` : affiche une merveille avec son nom et un toggle face A/B
- `PlayerScoreCard` : formulaire de saisie des points pour un joueur en cours de partie
- `LiveLeaderboard` : classement temps réel calculé côté client pendant la saisie
- `StatCard` : KPI avec valeur, label et icône
- `DateRangePicker` : sélecteur de période pour les statistiques (presets + custom)
- `FriendCombobox` : recherche parmi les amis dans le wizard de création de partie

### Formulaires
- Labels au-dessus des inputs
- Messages d'erreur directement sous le champ (rouge, icône ⚠)
- Bouton de soumission désactivé si formulaire invalide
- Spinner sur le bouton pendant la soumission, désactivé pour éviter le double-submit

---

## Structure de fichiers

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── game/
│   │   │   ├── new/page.tsx
│   │   │   └── [gameId]/score/page.tsx
│   │   ├── statistics/
│   │   │   ├── page.tsx
│   │   │   └── me/page.tsx
│   │   └── friends/page.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                      # shadcn/ui (généré, ne pas modifier)
│   ├── game/
│   │   ├── WonderCard.tsx
│   │   ├── PlayerScoreCard.tsx
│   │   └── LiveLeaderboard.tsx
│   ├── statistics/
│   │   ├── StatCard.tsx
│   │   └── DateRangePicker.tsx
│   ├── friends/
│   │   └── FriendCombobox.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── MobileHeader.tsx
│       └── ToasterProvider.tsx
│
├── lib/
│   ├── api/
│   │   ├── fetch.ts             # apiFetch wrapper (credentials + CSRF + refresh)
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   ├── statistics.ts
│   │   └── friends.ts
│   ├── query/
│   │   ├── keys.ts              # TanStack Query keys constants
│   │   └── hooks/               # useAuth, useGameOptions, useStats, useFriends...
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── game.schema.ts
│   │   └── friends.schema.ts
│   └── utils.ts                 # cn(), formatters (date, score, etc.)
│
├── stores/
│   ├── csrf.store.ts            # Zustand : csrfToken en mémoire
│   └── game-wizard.store.ts     # Zustand : état wizard (persisté sessionStorage)
│
├── middleware.ts
└── next.config.ts
```

---

## Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Toutes les requêtes utilisent `${process.env.NEXT_PUBLIC_API_URL}` comme base URL.
