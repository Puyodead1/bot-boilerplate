import Discord from "discord.js";
import Winston from "winston";
import fs from "fs";
import path from "path";
import BaseEvent from "./BaseEvent";
import BaseCommand from "./BaseCommand";

export default class Client extends Discord.Client {
  private _logger: Winston.Logger;
  public events = new Map<string, BaseEvent>();
  readonly commands = new Map<string, BaseCommand>();

  constructor(logger: Winston.Logger, options: Discord.ClientOptions) {
    super(options);

    this._logger = logger;
    this.loadEvents();
    this.loadCommands();
  }

  // getter for logger
  get logger(): Winston.Logger {
    return this._logger;
  }

  // function that loads events from the ./events directory
  private loadEvents(): void {
    // get all files in the events directory
    const files = fs
      .readdirSync(path.join(__dirname, "events"))
      .filter((file) => file.endsWith(".js"));

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

  // function that loads commands recursively from the commands directory
  private loadCommands(): void {
    const categories = fs.readdirSync(path.join(__dirname, "commands"));
    this.logger.info(
      `Loading ${categories.length} ${
        categories.length === 1 ? "category" : "categories"
      } of commands`
    );

    for (const category of categories) {
      // read the folder and get all files
      const files = fs
        .readdirSync(path.join(__dirname, "commands", category))
        .filter((file) => file.endsWith(".js"));

      this.logger.info(
        `Loading ${files.length} ${
          files.length === 1 ? "command" : "commands"
        } from ${category}`
      );

      // loop the files
      for (const file of files) {
        try {
          // get the command
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const command: BaseCommand = new (require(path.join(
            __dirname,
            "commands",
            category,
            file
          )).default)(this);

          // add the command to the map
          this.commands.set(command.data.name, command);
        } catch (e) {
          this.logger.error(`[Client] Failed to load command ${file}: ${e}`);
        }
      }
    }
  }
}
