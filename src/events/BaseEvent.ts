import Client from "../Client";

export abstract class BaseEvent {
  public name: string;
  public once: boolean;

  constructor(public client: Client, options: BaseEvent.Options) {
    this.name = options.name;
    this.once = options.once ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract run(...args: any[]): any;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace BaseEvent {
  export interface Options {
    name: string;
    once?: boolean;
  }
}
