import Client from "./Client";

export default abstract class BaseEvent {
  private _name: string;
  private _once: boolean;

  constructor(protected client: Client, options: BaseEvent.Options) {
    this._name = options.name;
    this._once = options.once ?? false;
  }

  get name(): string {
    return this._name;
  }

  get once(): boolean {
    return this._once;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract run(...args: any[]): any;
}

// eslint-disable-next-line no-redeclare
declare namespace BaseEvent {
  export interface Options {
    name: string;
    once?: boolean;
  }
}
