// ─── Enums ───────────────────────────────────────────────────────────────────

export type ExtensionId =
  | "VANILLA"
  | "LEADER"
  | "CITIES"
  | "ARMADA"
  | "EDIFICE"
  | "GRAND_PROJECT"
  | "BABEL"
  | "WONDER_PACK";

export type WonderId =
  | "OLYMPIA"
  | "EPHESOS"
  | "GIZAH"
  | "BABYLON"
  | "ALEXANDRIA"
  | "HALIKARNASSOS"
  | "RHODOS"
  | "BYZANTIUM"
  | "PETRA"
  | "MANNEKEN_PIS"
  | "ABU_SIMBEL"
  | "STONEHENGE"
  | "THE_GREAT_WALL"
  | "ROMA"
  | "UR"
  | "CARTHAGE"
  | "SIRACUSA";

export type PointTypeId =
  | "COIN"
  | "WONDER"
  | "LAND_WAR"
  | "ARMADA_WAR"
  | "COMMERCE"
  | "CIVIL"
  | "SCIENTIST"
  | "GUILD"
  | "LEADER"
  | "CITIES"
  | "ARMADA"
  | "EDIFICE"
  | "GRAND_PROJECT"
  | "BABEL";

export type Side = "A" | "B";
export type GameStatus = "STARTED" | "FINISHED";
export type FriendRequestStatus = "PENDING" | "ACCEPTED";
export type RelationshipState =
  | "NONE"
  | "FRIENDS"
  | "REQUEST_SENT"
  | "REQUEST_RECEIVED"
  | "SELF";

// ─── Mutation methods ─────────────────────────────────────────────────────────

export const MUTATION_METHODS = ["POST", "PATCH", "DELETE", "PUT"] as const;

// ─── Extension → PointType mapping ───────────────────────────────────────────

export const EXTENSION_POINT_TYPES: Record<ExtensionId, PointTypeId[]> = {
  VANILLA: [
    "COIN",
    "WONDER",
    "LAND_WAR",
    "COMMERCE",
    "CIVIL",
    "SCIENTIST",
    "GUILD",
  ],
  LEADER: ["LEADER"],
  CITIES: ["CITIES"],
  ARMADA: ["ARMADA_WAR", "ARMADA"],
  EDIFICE: ["EDIFICE"],
  GRAND_PROJECT: ["GRAND_PROJECT"],
  BABEL: ["BABEL"],
  WONDER_PACK: [],
};

// ─── PointType metadata (fallback until backend returns color/order) ──────────

export interface PointTypeMeta {
  id: PointTypeId;
  label: string;
  color: string;
  order: number;
}

export const POINT_TYPE_META: Record<PointTypeId, PointTypeMeta> = {
  COIN: { id: "COIN", label: "Pièces", color: "#e6a817", order: 1 },
  WONDER: { id: "WONDER", label: "Merveilles", color: "#a78bfa", order: 2 },
  LAND_WAR: {
    id: "LAND_WAR",
    label: "Guerre terrestre",
    color: "#ef4444",
    order: 3,
  },
  ARMADA_WAR: {
    id: "ARMADA_WAR",
    label: "Guerre navale",
    color: "#f97316",
    order: 4,
  },
  COMMERCE: { id: "COMMERCE", label: "Commerce", color: "#facc15", order: 5 },
  CIVIL: { id: "CIVIL", label: "Bâtiments civils", color: "#60a5fa", order: 6 },
  SCIENTIST: { id: "SCIENTIST", label: "Science", color: "#34d399", order: 7 },
  GUILD: { id: "GUILD", label: "Guildes", color: "#c084fc", order: 8 },
  LEADER: { id: "LEADER", label: "Leaders", color: "#fb7185", order: 9 },
  CITIES: { id: "CITIES", label: "Cités", color: "#94a3b8", order: 10 },
  ARMADA: { id: "ARMADA", label: "Armada", color: "#38bdf8", order: 11 },
  EDIFICE: { id: "EDIFICE", label: "Édifices", color: "#a3e635", order: 12 },
  GRAND_PROJECT: {
    id: "GRAND_PROJECT",
    label: "Grands Projets",
    color: "#fbbf24",
    order: 13,
  },
  BABEL: { id: "BABEL", label: "Babel", color: "#f472b6", order: 14 },
};

// ─── API Interfaces ───────────────────────────────────────────────────────────

export interface AuthUser {
  userId: string;
}

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth

export interface SignInBody {
  email: string;
  password: string;
}

export interface SignUpBody {
  email: string;
  password: string;
}

// Game Options

export interface WonderSide {
  side: Side;
  requiredExtensions: ExtensionId[];
}

export interface Wonder {
  id: WonderId;
  name: string;
  extensionId: ExtensionId;
  sides: WonderSide[];
}

export interface Extension {
  id: ExtensionId;
  name: string;
}

export interface PointType {
  id: PointTypeId;
  name: string;
  color?: string;
  order?: number;
}

export interface GameOptions {
  extensions: Extension[];
  wonders: Wonder[];
  pointTypes?: PointType[];
}

// Game Creation

export interface CreateGamePlayerBody {
  userId?: string;
  name: string;
  email?: string;
  wonderId: WonderId;
  wonderSide: Side;
}

export interface CreateGameBody {
  extensionIds: ExtensionId[];
  players: CreateGamePlayerBody[];
}

export interface CreateGameResponse {
  id: string;
  slug: string;
  status: GameStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  players: Array<{ id: string; name: string }>;
}

// Score

export interface PlayerScorePoint {
  pointTypeId: PointTypeId;
  points: number;
}

export interface PlayerScoreBody {
  playerId: string;
  coins: number;
  points: PlayerScorePoint[];
}

export interface UpsertGameScoreBody {
  players: PlayerScoreBody[];
}

// Statistics

export interface StatisticsResponse {
  totalFinishedGames: number;

  byPlayer: Array<{
    playerKey: string;
    userId: string | null;
    label: string;
    games: number;
    averageScore: number;
    winRate: number;
  }>;

  scoreDistribution: Array<{
    label: string;
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
    month: string;
    games: number;
    averageScore: number;
  }>;

  competitiveness: {
    averageGap: number;
    distribution: Array<{
      label: string;
      count: number;
    }>;
  };
}

// Friends

export interface SendFriendRequestBody {
  receiverId: string;
}

export interface FriendRequest {
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
}

export interface ReceivedRequest extends FriendRequest {
  sender: SafeUser;
}

export interface SentRequest extends FriendRequest {
  receiver: SafeUser;
}

export interface FriendEntry {
  createdAt: string;
  friend: SafeUser;
}

export interface RelationshipStatusResponse {
  state: RelationshipState;
}

// Error

export interface ApiError {
  statusCode: number;
  message: string | { code: string; message: string };
}

export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
