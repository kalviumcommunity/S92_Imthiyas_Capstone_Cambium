/**
 * Cambium Living Materials — Authentic Scholar Research Cadence Simulator
 * Generates deterministic, organic, scattered research contributions
 * modeling realistic academic conference crunch cycles, lab experiments,
 * and quiet sabbatical gaps with 100% deterministic SSR-safe hydration.
 */

export interface ScholarContribution {
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
  activity: string;
  label: string;
}

const ACTIVITY_POOLS: Record<number, string[]> = {
  4: [
    'Manuscript submitted to IEEE TPAMI',
    'Preprint released on arXiv:2603.09412',
    'NIH Grant R01 Milestone delivered',
    'Foundation model weights v2.4 released',
    'Conference Camera-Ready submission'
  ],
  3: [
    'Double-blind peer review completed',
    'Ablation benchmark experiment finished',
    'Cross-lab collaborative sync & co-draft',
    'Federated client convergence checkpoint',
    'Clinical trial validation protocol signed'
  ],
  2: [
    'Dataset curation & validation split',
    'PyTorch training pipeline optimization',
    'Systematic literature survey synthesis',
    'Statistical significance run (p < 0.001)',
    'Experimental protocol calibration'
  ],
  1: [
    'Research lab notebook entry logged',
    'Draft abstract & bibliography update',
    'Reviewer response comments outlined',
    'Hyperparameter search space recorded',
    'Code repository refactor & lint'
  ]
};

export const SCHOLAR_ACTIVITY_BADGES = [
  'Manuscript Submissions',
  'ArXiv Preprints',
  'Peer Reviews',
  'Benchmark Experiments',
  'Dataset Releases',
  'Grant Milestones',
  'Lab Collaborations',
  'Research Notes',
];

/**
 * Computes deterministic natural activity level (0-4) for a given week (0..51) and day (0..6).
 * Day 0 is Sunday, Day 6 is Saturday.
 */
export function getNaturalScholarContributionLevel(w: number, d: number): 0 | 1 | 2 | 3 | 4 {
  const isWeekend = d === 0 || d === 6;
  const isMidweek = d >= 2 && d <= 4;

  // Seasonal cadence with multi-frequency academic sprints (e.g. CVPR/NeurIPS deadlines, grant cutoffs)
  const seasonWave =
    0.34 * Math.sin((w - 4) * 0.22) +
    0.20 * Math.sin((w - 18) * 0.44) +
    0.18 * Math.cos((w - 32) * 0.28) -
    (w >= 20 && w <= 23 ? 0.25 : 0) - // Mid-year conference quiet lull
    (w >= 50 ? 0.35 : 0);              // Winter break holiday lull

  const sprintIntensity = Math.min(0.90, Math.max(0.10, 0.48 + seasonWave));

  // High-entropy 32-bit integer mixer
  let h = ((w * 41) ^ (d * 73) ^ ((w + 17) * (d + 31) * 67)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x5cd02441);
  h = Math.imul(h ^ (h >>> 13), 0x47b594b5);
  const rand = ((h ^ (h >>> 16)) >>> 0) / 4294967296;

  let h2 = ((w * 89) ^ (d * 113) ^ 0x9e3779b9) >>> 0;
  h2 = Math.imul(h2 ^ (h2 >>> 16), 0x85ebca6b);
  const rand2 = ((h2 ^ (h2 >>> 13)) >>> 0) / 4294967296;

  // Weekends have lower probability of activity; Midweek has higher focus
  const activeThreshold = isWeekend ? sprintIntensity * 0.32 : isMidweek ? Math.min(0.95, sprintIntensity * 1.08) : sprintIntensity;
  if (rand > activeThreshold) return 0;

  const intensityBias = sprintIntensity * 0.52 + rand2 * 0.48;
  if (intensityBias > 0.83) return 4;
  if (intensityBias > 0.65) return 3;
  if (intensityBias > 0.44) return 2;
  return 1;
}

/**
 * Returns full scholarly details (action count, activity title, hover label)
 */
export function getScholarContributionDetails(w: number, d: number): ScholarContribution {
  const level = getNaturalScholarContributionLevel(w, d);
  if (level === 0) {
    return { level: 0, count: 0, activity: 'No public scholarly activity recorded', label: 'No activity' };
  }
  const pool = ACTIVITY_POOLS[level];
  const idx = ((w * 17) ^ (d * 37) ^ (level * 11)) % pool.length;
  const count =
    level === 4 ? 11 + ((w * 3 + d) % 7) :
    level === 3 ? 6 + ((w * 2 + d) % 4) :
    level === 2 ? 3 + ((w + d) % 3) :
    1 + ((w + d) % 2);
  const activity = pool[idx];
  return {
    level,
    count,
    activity,
    label: `${activity} • ${count} action${count > 1 ? 's' : ''}`,
  };
}
