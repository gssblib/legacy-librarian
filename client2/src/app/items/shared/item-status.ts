/**
 * Stati of an item.
 */

export enum Availability {
  AVAILABLE = 'AVAILABLE',
  CHECKED_OUT = 'CHECKED_OUT',
  ORDERED = 'ORDERED',
}


export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  CHECKED_OUT = 'CHECKED_OUT',
  ORDERED = 'ORDERED',
  STORED = 'STORED',
  DELETED = 'DELETED',
  LOST = 'LOST',
  IN_REPAIR = 'IN_REPAIR',
}

export function getAvailabilityLabel(availability: Availability): string {
  switch (availability) {
    case Availability.AVAILABLE: return 'Available';
    case Availability.CHECKED_OUT: return 'Checked Out';
    case Availability.ORDERED: return 'Ordered';
  }
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

