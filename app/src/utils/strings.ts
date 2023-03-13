import { PriceData } from "@/types/price";

export const capitalise = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Merge 2 price data arrays.
 * The first element in the array is the date.
 * The second element in the array is the price.
 * @param first
 * @param second
 * @returns
 */
export const mergePriceData = (
  first: number[][],
  second: number[][]
): number[][] => {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < first.length && j < second.length) {
    if (first[i][0] < second[j][0]) {
      merged.push(first[i]);
      i++;
    } else {
      merged.push(second[j]);
      j++;
    }
  }
  while (i < first.length) {
    merged.push(first[i]);
    i++;
  }
  while (j < second.length) {
    merged.push(second[j]);
    j++;
  }
  return merged;
};

export const sampleData = (data: any[], numSamples: number) => {
  const samples = [];
  const step = Math.floor(data.length / numSamples);
  for (let i = 0; i < data.length; i += step) {
    samples.push(data[i]);
  }
  return samples;
};
