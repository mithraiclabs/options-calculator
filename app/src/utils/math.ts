export const round = (num: number | undefined, dp: number): number => {
  if (num === undefined) {
    return 0;
  }
  return Math.round(num * 10 ** dp) / 10 ** dp;
};
