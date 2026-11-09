import Progress, {
  ON_CHANGE,
  ON_TOTAL_CHANGE,
  ProgressInterface,
} from "@/libraries/common/Progress";
import events from "events";

const sum = (previous: number, current: number) => previous + current;

export default class ProgressGroup implements ProgressInterface {
  private _progresses: Progress[] = [];

  private _done = 0;

  private _total = 0;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  public AddProgresses(...progresses: Progress[]) {
    progresses.forEach((progress: Progress) => {
      this._progresses.push(progress);
      progress.on(ON_CHANGE, () => this.computeDone());
      progress.on(ON_TOTAL_CHANGE, () => this.computeTotal());
    });

    this.computeTotal();
  }

  public get(): { done: number; total: number } {
    return {
      done: this._done,
      total: this._total,
    };
  }

  public getRatio(): number {
    if (this._total === 0) {
      return 0;
    }

    return this._done / this._total;
  }

  private computeDone() {
    this._done = this._progresses
      .map((p: Progress) => p.get().done)
      .reduce(sum, 0);

    this._eventEmitter.emit(ON_CHANGE, this._done);
  }

  private computeTotal() {
    this._total = this._progresses
      .map((p: Progress) => p.get().total)
      .reduce(sum, 0);

    this._eventEmitter.emit(ON_TOTAL_CHANGE, this._total);
  }

  public getNewOne(): Progress {
    const progress = new Progress();
    this.AddProgresses(progress);
    return progress;
  }

  public onChange(callback: () => void) {
    this._eventEmitter.on(ON_CHANGE, callback);
  }

  public offChange(callback: () => void) {
    this._eventEmitter.off(ON_CHANGE, callback);
  }
}
