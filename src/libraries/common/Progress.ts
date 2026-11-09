import events from "events";

export const ON_CHANGE = "change";
export const ON_TOTAL_CHANGE = "totalChange";

export interface ProgressInterface {
  get(): { done: number; total: number };
  getRatio(): number;
}

export default class Progress implements ProgressInterface {
  private _done = 0;

  private _total = 0;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  public plusOne() {
    this.set(this._done + 1);
  }

  public set(done: number) {
    if (done >= 0) {
      this._done = done;
      this._eventEmitter.emit(ON_CHANGE, this._done);
    }
  }

  public setTotal(total: number) {
    if (total >= 0) {
      this._total = total;
      this._eventEmitter.emit(ON_TOTAL_CHANGE, this._total);
    }
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

  public on(event: string | symbol, listener: (...args: any[]) => void) {
    this._eventEmitter.on(event, listener);
  }

  public onChange(callback: () => void) {
    this._eventEmitter.on(ON_CHANGE, callback);
  }

  public offChange(callback: () => void) {
    this._eventEmitter.off(ON_CHANGE, callback);
  }
}
