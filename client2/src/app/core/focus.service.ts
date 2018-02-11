import { Injectable } from "@angular/core";

/**
 * Global focus service.
 */
@Injectable()
export class FocusService {
  /**
   * Global map of "focus-able" objects.
   *
   * The key is the name of the focus-able object and the value the function
   * that puts the focus on this object.
   */
  focuses: {[name: string]: () => void} = {};

  /**
   * Tries to set the focus of the focus-able object with the given name.
   */
  setFocus(name: string) {
    const focus = this.focuses[name];
    if (focus) {
      focus();
    }
  }

  /**
   * Registers a focus-able object.
   */
  add(name: string, focus: () => void) {
    this.focuses[name] = focus;
  }

  /**
   * Unregisters a focus-able object.
   */
  remove(name: string) {
    delete this.focuses[name];
  }
}
