import { logger } from "./logger";

export const pErr = (err: Error) => {
  if (err) {
    logger.error(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

/**
 * Merge the two array and keep only unique value
 * @param arr First array
 * @param arr2 Second array
 */
export const mergeUniqueArrays = (arr: string[], arr2: string[]): string[] => {
  return arr.concat(arr2).filter(onlyUnique);
};
