
import {Params} from "@angular/router";

/**
 * Adds utility methods to Params.
 */
export class ParamsUtil {
  constructor(private params: Params) {}

  getNumber(name: string, defaultValue?: number) {
    const value = this.params[name];
    return value ? +value : defaultValue;
  }

  mergeInto(target, names: string[]) {
    for (let name of names) {
      const value = this.params[name];
      if (value) {
        target[name] = value;
      }
    }
  }

  getValues(names: string[]) {
    const values = {};
    for (let name of names) {
      const value = this.params[name];
      if (value !== undefined) {
        values[name] = value;
      }
    }
    return values;
  }
}
