export const addMillisecondsFromNow = (ms: number): Date =>
  new Date(Date.now() + ms);

export const ONE_HOUR_IN_MS = 60 * 60 * 1000;
