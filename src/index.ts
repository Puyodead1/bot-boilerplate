import dotenv from "dotenv";
import Client from "./Client";
import Winston from "winston";
import { deployCommands } from "./deployCommands";
import commander from "commander";

dotenv.config();

const program = new commander.Command();
program.addOption(
  new commander.Option("-d, --deploy", "Deploy Application Commands")
);
program.parse();
const options = program.opts();

const logger = Winston.createLogger({
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
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
});

if (options.deploy) {
  logger.info("Deploying Application Commands");

  deployCommands(
    logger,
    process.env.TOKEN,
    process.env.CLIENT_ID,
    process.env.GUILD_ID
  )
    .then(() => {
      logger.info("Application Commands Deployed");
      process.exit(0);
    })
    .catch((e) => {
      logger.error(`Failed to deploy application commands: ${e}`);
      process.exit(1);
    });
} else {
  const client = new Client(logger, {
    intents: ["GUILD_MESSAGES"],
  });

  client.login(process.env.TOKEN);
}
