export class SortKey {
  constructor(readonly name: string, readonly order: string) {}

  toString(): string {
    return this.order == 'ASC' ? this.name : '-' + this.name;
  }

  toggle(): SortKey {
    return new SortKey(this.name, SortKey.toggleOrder(this.order));
  }

  static toggleOrder(order: string) {
    return order === 'ASC' ? 'DESC' : 'ASC';
  }

  static fromString(s: string): SortKey {
    const order = s.startsWith('-') ? 'DESC' : 'ASC';
    const name = order == 'ASC' ? s : s.substring(1);
    return new SortKey(name, order);
  }
}
