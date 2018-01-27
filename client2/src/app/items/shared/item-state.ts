/**
 * States of an item.
 *
 * The first four values are the actual states stored in the database. The last
 * two values (CHECKOUT_OUT and AVAILABLE) are variations of CIRCULATING.
 */
export enum ItemState {
  CIRCULATING,
  STORED,
  DELETED,
  LOST,
  CHECKED_OUT,
  AVAILABLE,
}

export function getItemStateLabel(state: ItemState): string {
  switch (state) {
    case ItemState.CIRCULATING: return 'Circulating';
    case ItemState.STORED: return 'Stored';
    case ItemState.AVAILABLE: return 'Available';
    case ItemState.CHECKED_OUT: return 'Checked Out';
    case ItemState.DELETED: return 'Deleted';
    case ItemState.LOST: return 'Lost';
  }
}

