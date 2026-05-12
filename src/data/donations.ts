export type DonationOption = 1 | 2 | 3;

export interface DonationTier {
  readonly option: DonationOption;
  readonly defaultAmount: number;
  readonly titleIdx: number;
  readonly ledeIdx: number;
}

export const DONATION_TIERS: readonly DonationTier[] = [
  { option: 1, defaultAmount: 0,   titleIdx: 8,  ledeIdx: 12 },
  { option: 2, defaultAmount: 25,  titleIdx: 9,  ledeIdx: 13 },
  { option: 3, defaultAmount: 100, titleIdx: 10, ledeIdx: 14 },
] as const;

export const AMOUNT_PRESETS: readonly number[] = [0, 25, 50, 100, 250] as const;

export function parseDonationOption(raw: unknown): DonationOption {
  const str = Array.isArray(raw) ? raw[0] : raw;
  const n = typeof str === "string" ? parseInt(str, 10) : NaN;
  return n === 2 || n === 3 ? n : 1;
}

export function tierFor(option: number): DonationTier {
  return DONATION_TIERS.find(t => t.option === option) ?? DONATION_TIERS[0];
}
