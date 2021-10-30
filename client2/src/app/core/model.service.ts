import { ModelsService } from "./models.service";
import { Subject, Subscription } from "rxjs";

/**
 * Keeps the current model object (item, borrower) of type T and manages
 * its state.
 */
export class ModelService<T> {

  /** Current model object. */
  private model: T;

  private readonly modelSubject = new Subject<T>();
  readonly modelObservable = this.modelSubject.asObservable();

  constructor(private readonly modelsService: ModelsService<T>, private readonly loadParams?: any) {
    this.modelObservable.subscribe(model => this.model = model);
  }

  get(): T {
    return this.model;
  }

  set(model: T) {
    this.model = model;
    this.modelSubject.next(model);
  }

  load(id: any) {
    this.modelsService.get(id, this.loadParams).subscribe(this.set.bind(this))
  }

  reload() {
    if (this.model) {
      this.load(this.modelsService.id(this.model));
    }
  }

  subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.modelObservable.subscribe(next, error, complete);
  }
}
