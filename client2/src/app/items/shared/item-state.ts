export enum ItemState {
  CIRCULATING,
  STORED,
  DELETED,
  LOST,
  /** Implies CIRCULATING. */
  CHECKED_OUT,
  /** Implies CIRCULATING. */
  AVAILABLE,
}

export const ItemStateLabels = {
  CIRCULATING: 'Circulating',
  STORED: 'Stored',
  DELETED: 'Deleted',
  LOST: 'Lost',
  CHECKED_OUT: 'Checked Out',
  AVAILABLE: 'Available',
}
