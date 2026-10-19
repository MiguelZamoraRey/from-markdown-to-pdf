export interface HeadingSizes {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
}

const HEADING_RATIOS: HeadingSizes = {
  h1: 2,
  h2: 1.6,
  h3: 1.35,
  h4: 1.2,
  h5: 1.1,
  h6: 1.05,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function headingSizes(basePx: number): HeadingSizes {
  return {
    h1: round2(basePx * HEADING_RATIOS.h1),
    h2: round2(basePx * HEADING_RATIOS.h2),
    h3: round2(basePx * HEADING_RATIOS.h3),
    h4: round2(basePx * HEADING_RATIOS.h4),
    h5: round2(basePx * HEADING_RATIOS.h5),
    h6: round2(basePx * HEADING_RATIOS.h6),
  };
}
