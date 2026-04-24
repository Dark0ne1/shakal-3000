export const DEGRADATION_MODES = [
  "geocities",
  "hacker",
  "corporate",
  "princess",
] as const;

export type DegradationMode = (typeof DEGRADATION_MODES)[number];

export const DEFAULT_DEGRADATION_MODE: DegradationMode = "geocities";

export type DegradationModeOption = {
  value: DegradationMode;
  label: string;
  description: string;
};

export const DEGRADATION_MODE_OPTIONS: DegradationModeOption[] = [
  {
    value: "geocities",
    label: "GeoCities",
    description: "Кислотные цвета, GIF-мусор и максимальная домашняя страничка 1999 года.",
  },
  {
    value: "hacker",
    label: "Hacker Terminal",
    description: "Терминальный мрак, зелёные буквы и ощущение, что сайт взломали в подвале.",
  },
  {
    value: "corporate",
    label: "Corporate Hell 2001",
    description: "Серые панели, синий офисный ужас и корпоративный портал, от которого болят глаза.",
  },
  {
    value: "princess",
    label: "Princess Homepage",
    description: "Розовый блеск, домашняя страничка мечты и сахарный перегруз.",
  },
];

export function normalizeDegradationMode(
  rawMode: string | null | undefined,
): DegradationMode {
  if (!rawMode) {
    return DEFAULT_DEGRADATION_MODE;
  }

  return DEGRADATION_MODE_OPTIONS.find((option) => option.value === rawMode)?.value
    ?? DEFAULT_DEGRADATION_MODE;
}

export function getDegradationModeOption(mode: DegradationMode) {
  return (
    DEGRADATION_MODE_OPTIONS.find((option) => option.value === mode) ??
    DEGRADATION_MODE_OPTIONS[0]
  );
}
