export const blacklistedTokens: Set<string> = new Set();

export const addToBlacklist = (token: string) => {
  blacklistedTokens.add(token);
};

export const isBlacklisted = (token: string): boolean => {
  return blacklistedTokens.has(token);
};
