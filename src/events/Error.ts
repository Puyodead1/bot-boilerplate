import Client from "../Client";
import { BaseEvent } from "./BaseEvent";

export default class UserEvent extends BaseEvent {
  constructor(client: Client) {
    super(client, {
      name: "error",
      once: false,
    });
  }

  run(msg: string): void {
    this.client.logger.error(`[Discord]: ${msg}`);
  }
}
