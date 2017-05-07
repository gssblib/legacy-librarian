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
