/**
 * Single column/field sort key with direction.
 */
export class SortKey {
  constructor(readonly name: string, readonly order: string) {}

  /**
   * Converts this sort key to the corresponding sort order query parameter string.
   */
  toString(): string {
    return this.order == 'ASC' ? this.name : '-' + this.name;
  }

  /**
   * Returns a new `SortKey` with the opposite sort direction.
   */
  toggle(): SortKey {
    return new SortKey(this.name, SortKey.toggleOrder(this.order));
  }

  static toggleOrder(order: string) {
    return order === 'ASC' ? 'DESC' : 'ASC';
  }

  /**
   * Parses a sort order query parameter and returns the resulting `SortKey`.
   */
  static fromString(s: string): SortKey {
    const order = s.startsWith('-') ? 'DESC' : 'ASC';
    const name = order == 'ASC' ? s : s.substring(1);
    return new SortKey(name, order);
  }
}
