import Discord from "discord.js";
import Winston from "winston";
import fs from "fs";
import path from "path";
import { BaseEvent } from "./events/BaseEvent";

export default class Client extends Discord.Client {
  private _logger: Winston.Logger;
  public events = new Map<string, BaseEvent>();

  constructor(options: Discord.ClientOptions) {
    super(options);

    // make logger for this client
    this._logger = this.createLogger();
    this.loadEvents();
  }

  // getter for logger
  get logger(): Winston.Logger {
    return this._logger;
  }

  // returns a configured logger
  private createLogger(): Winston.Logger {
    return Winston.createLogger({
      level: process.env.LOG_LEVEL ?? "info",
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.simple()
      ),
      defaultMeta: { service: "user-service" },
      transports: [
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format.timestamp({
              format: "HH:mm:ss",
            }),
            Winston.format.colorize(),
            Winston.format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`
            )
          ),
        }),
      ],
    });
  }

  // function that loads events from the ./events directory
  private loadEvents(): void {
    // get all files in the events directory
    const files = fs
      .readdirSync(path.join(__dirname, "events"))
      .filter((file) => file.endsWith(".js") && !file.endsWith("BaseEvent.js"));

    // for each file
    for (const file of files) {
      try {
        // get the event
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const event: BaseEvent = new (require(path.join(
          __dirname,
          "events",
          file
        )).default)(this);

        // add the event to the map
        this.events.set(event.name, event);

        // add event to the client
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.on(event.name, (...args: any[]) => event.run(...args));
      } catch (e) {
        this.logger.error(`[Client] Failed to load event ${file}: ${e}`);
      }
    }

    // log the number of events loaded
    this.logger.info(`[Client] Loaded ${this.events.size} events`);
  }
}
