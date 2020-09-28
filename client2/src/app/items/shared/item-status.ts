/**
 * Stati of an item.
 *
 */
export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  CHECKED_OUT = 'CHECKED_OUT',
  ORDERED = 'ORDERED',
  STORED = 'STORED',
  DELETED = 'DELETED',
  LOST = 'LOST',
  IN_REPAIR = 'IN_REPAIR',
}

export function getItemStatusLabel(status: ItemStatus): string {
  switch (status) {
    case ItemStatus.STORED: return 'Stored';
    case ItemStatus.AVAILABLE: return 'Available';
    case ItemStatus.CHECKED_OUT: return 'Checked Out';
    case ItemStatus.ORDERED: return 'Ordered';
    case ItemStatus.DELETED: return 'Deleted';
    case ItemStatus.LOST: return 'Lost';
    case ItemStatus.IN_REPAIR: return 'In Repair';
  }
}

