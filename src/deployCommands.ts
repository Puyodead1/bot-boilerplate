import Winston from "winston";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import path from "path";
import BaseCommand from "./BaseCommand";

const loadCommands = (logger: Winston.Logger) => {
  const commands = [];
  const categories = fs.readdirSync(path.join(__dirname, "commands"));

  for (const category of categories) {
    // read the folder and get all files
    const files = fs
      .readdirSync(path.join(__dirname, "commands", category))
      .filter((file) => file.endsWith(".js"));

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
          // eslint-disable-next-line new-cap
        )).default)(this);

        // add the command to the map
        commands.push(command.data.toJSON());
      } catch (e) {
        logger.error(`Failed to load command ${file}: ${e}`);
      }
    }
  }
  return commands;
};

export const deployCommands = (
  logger: Winston.Logger,
  token?: string,
  clientId?: string,
  guildId?: string
) => {
  if (!token || token === "") throw new Error("Token cannot be empty");
  if (!clientId || clientId === "")
    throw new Error("Client ID cannot be empty");
  if (!guildId || guildId === "") throw new Error("Guild ID cannot be empty");

  const rest = new REST({ version: "9" }).setToken(token);

  const commands = loadCommands(logger);

  return rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
