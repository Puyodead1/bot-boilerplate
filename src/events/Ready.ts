import Client from "../Client";
import { BaseEvent } from "./BaseEvent";

export default class UserEvent extends BaseEvent {
  constructor(client: Client) {
    super(client, {
      name: "ready",
      once: true,
    });
  }

  run(): unknown {
    if (!this.client.user)
      return this.client.logger.error("User is not defined");
    this.client.logger.info(
      `[Discord] Connected to Discord as ${this.client.user.tag}`
    );
  }
}
