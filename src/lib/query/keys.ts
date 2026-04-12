interface StatsParams {
  from?: string;
  to?: string;
}

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  game: {
    options: () => ["game", "options"] as const,
  },
  statistics: {
    global: (params: StatsParams) => ["statistics", "global", params] as const,
    me: (params: StatsParams) => ["statistics", "me", params] as const,
  },
  friends: {
    list: () => ["friends", "list"] as const,
    received: () => ["friends", "received"] as const,
    sent: () => ["friends", "sent"] as const,
    status: (targetUserId: string) =>
      ["friends", "status", targetUserId] as const,
  },
} as const;
