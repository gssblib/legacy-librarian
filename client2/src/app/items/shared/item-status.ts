/**
 * Stati of an item.
 *
 */
export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  CHECKED_OUT = 'CHECKED_OUT',
  STORED = 'STORED',
  DELETED = 'DELETED',
  LOST = 'LOST',
}

export function getItemStatusLabel(status: ItemStatus): string {
  switch (status) {
    case ItemStatus.STORED: return 'Stored';
    case ItemStatus.AVAILABLE: return 'Available';
    case ItemStatus.CHECKED_OUT: return 'Checked Out';
    case ItemStatus.DELETED: return 'Deleted';
    case ItemStatus.LOST: return 'Lost';
  }
}

