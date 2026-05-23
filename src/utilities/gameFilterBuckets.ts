/** Fascia durata in minuti (estremo superiore escluso tranne 300+). */
export type DurationBucketId =
  | '0-30'
  | '30-60'
  | '60-90'
  | '90-120'
  | '120-150'
  | '150-180'
  | '180-210'
  | '210-240'
  | '240-270'
  | '270-300'
  | '300+'

export type DurationBucket = {
  id: DurationBucketId
  min: number
  max: number | null
}

export const DURATION_BUCKETS: DurationBucket[] = [
  { id: '0-30', min: 0, max: 30 },
  { id: '30-60', min: 30, max: 60 },
  { id: '60-90', min: 60, max: 90 },
  { id: '90-120', min: 90, max: 120 },
  { id: '120-150', min: 120, max: 150 },
  { id: '150-180', min: 150, max: 180 },
  { id: '180-210', min: 180, max: 210 },
  { id: '210-240', min: 210, max: 240 },
  { id: '240-270', min: 240, max: 270 },
  { id: '270-300', min: 270, max: 300 },
  { id: '300+', min: 300, max: null },
]

/** Valori selezionabili per filtro giocatori (1–9 e 10+). */
export const PLAYER_FILTER_VALUES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10+',
] as const

export type PlayerFilterValue = (typeof PLAYER_FILTER_VALUES)[number]
