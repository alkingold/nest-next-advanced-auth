import { randomInt } from 'node:crypto';

export const generateSixDigitCodeDeprecated = () =>
  Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();

export const generateSixDigitCode = (): string =>
  randomInt(100000, 1000000).toString();
