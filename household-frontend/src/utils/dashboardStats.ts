import type { Person } from '../types/person';
import type { Household } from '../types/household';
import type { PopulationEvent } from '../api/populationEventApi';

export interface PopulationOverviewData {
  totalPersons: number;
  byStatus: {
    permanent: number;
    temporary: number;
    absent: number;
  };
}

export interface AgeGroupDatum {
  range: '0-5' | '6-14' | '15-24' | '25-59' | '60+';
  male: number;
  female: number;
}

export interface AgeStructureData {
  ageGroups: AgeGroupDatum[];
  dependencyRatio: number;
}

export interface PopulationMovementData {
  inflow: {
    birth: number;
    moveIn: number;
  };
  outflow: {
    death: number;
    moveOut: number;
  };
}

export interface HouseholdSizeDistributionData {
  distribution: Array<{
    label: '1 người' | '2–3 người' | '4–5 người' | '6+ người';
    value: number;
  }>;
  avgSize: number;
}

export interface DashboardStats {
  populationOverview: PopulationOverviewData;
  ageStructure: AgeStructureData;
  movement: PopulationMovementData;
  householdSize: HouseholdSizeDistributionData;
}

const stripDiacritics = (value: string) =>
  value
    .normalize('NFD')
    // eslint-disable-next-line no-control-regex
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const safeNumber = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? n : 0);

const getAgeYears = (dob: Date | string) => {
  const d = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return Math.max(0, age);
};

const isMale = (gender: string | undefined) => {
  const g = stripDiacritics(gender ?? '');
  return g === 'male' || g === 'nam' || g === 'm';
};

const isFemale = (gender: string | undefined) => {
  const g = stripDiacritics(gender ?? '');
  return g === 'female' || g === 'nu' || g === 'nữ' || g === 'f';
};

const classifyMigrationStatus = (status: string | null | undefined) => {
  const s = stripDiacritics(status ?? '');

  // Permanent
  if (s.includes('thuong tru') || s.includes('permanent')) return 'permanent' as const;

  // Temporary
  if (s.includes('tam tru') || s.includes('temporary')) return 'temporary' as const;

  // Absent
  if (s.includes('tam vang') || s.includes('absent')) return 'absent' as const;

  return 'unknown' as const;
};

export const buildPopulationOverview = (persons: Person[]): PopulationOverviewData => {
  const totalPersons = persons.length;
  const byStatus = { permanent: 0, temporary: 0, absent: 0 };

  for (const person of persons) {
    const bucket = classifyMigrationStatus(person.migrationStatus);
    if (bucket === 'permanent') byStatus.permanent += 1;
    else if (bucket === 'temporary') byStatus.temporary += 1;
    else if (bucket === 'absent') byStatus.absent += 1;
    else byStatus.permanent += 1;
  }

  return { totalPersons, byStatus };
};

export const buildAgeStructure = (persons: Person[]): AgeStructureData => {
  const ranges: AgeGroupDatum[] = [
    { range: '0-5', male: 0, female: 0 },
    { range: '6-14', male: 0, female: 0 },
    { range: '15-24', male: 0, female: 0 },
    { range: '25-59', male: 0, female: 0 },
    { range: '60+', male: 0, female: 0 },
  ];

  const bump = (idx: number, gender: string) => {
    if (isMale(gender)) ranges[idx].male += 1;
    else if (isFemale(gender)) ranges[idx].female += 1;
    else {
      // unknown gender → split softly to avoid bias
      ranges[idx].male += 0.5;
      ranges[idx].female += 0.5;
    }
  };

  for (const person of persons) {
    const age = getAgeYears(person.dateOfBirth);
    if (age == null) continue;

    if (age <= 5) bump(0, person.gender);
    else if (age <= 14) bump(1, person.gender);
    else if (age <= 24) bump(2, person.gender);
    else if (age <= 59) bump(3, person.gender);
    else bump(4, person.gender);
  }

  const dependents = safeNumber(ranges[0].male + ranges[0].female)
    + safeNumber(ranges[1].male + ranges[1].female)
    + safeNumber(ranges[4].male + ranges[4].female);
  const working = safeNumber(ranges[2].male + ranges[2].female)
    + safeNumber(ranges[3].male + ranges[3].female);

  const dependencyRatio = working > 0 ? dependents / working : 0;

  return {
    ageGroups: ranges,
    dependencyRatio,
  };
};

const normalizeEventType = (t: string) => stripDiacritics(t);

const isMoveOutDescription = (desc?: string) => {
  const d = stripDiacritics(desc ?? '');
  return d.includes('move out') || d.includes('out') || d.includes('chuyen di') || d.includes('di');
};

export const buildPopulationMovement = (events: PopulationEvent[]): PopulationMovementData => {
  let birth = 0;
  let death = 0;
  let moveIn = 0;
  let moveOut = 0;

  for (const e of events) {
    const type = normalizeEventType(e.type);

    if (type === 'birth' || type.includes('sinh')) {
      birth += 1;
      continue;
    }

    if (type === 'death' || type.includes('tu')) {
      death += 1;
      continue;
    }

    // Migration heuristic
    if (type === 'migration' || type.includes('migrate') || type.includes('chuyen')) {
      if (isMoveOutDescription((e as any).description)) moveOut += 1;
      else moveIn += 1;
    }
  }

  return {
    inflow: { birth, moveIn },
    outflow: { death, moveOut },
  };
};

export const buildHouseholdSizeDistribution = (households: Household[]): HouseholdSizeDistributionData => {
  const buckets = {
    '1 người': 0,
    '2–3 người': 0,
    '4–5 người': 0,
    '6+ người': 0,
  } as const;

  let totalMembers = 0;
  let householdCount = 0;

  for (const household of households) {
    const size = Array.isArray((household as any).members) ? (household as any).members.length : 0;
    householdCount += 1;
    totalMembers += size;

    if (size <= 1) (buckets as any)['1 người'] += 1;
    else if (size <= 3) (buckets as any)['2–3 người'] += 1;
    else if (size <= 5) (buckets as any)['4–5 người'] += 1;
    else (buckets as any)['6+ người'] += 1;
  }

  const avgSize = householdCount > 0 ? totalMembers / householdCount : 0;

  return {
    distribution: [
      { label: '1 người', value: buckets['1 người'] },
      { label: '2–3 người', value: buckets['2–3 người'] },
      { label: '4–5 người', value: buckets['4–5 người'] },
      { label: '6+ người', value: buckets['6+ người'] },
    ],
    avgSize,
  };
};
