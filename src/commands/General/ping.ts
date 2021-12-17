import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import BaseCommand from "../../BaseCommand";
import Client from "../../Client";

export default class UserCommand extends BaseCommand {
  constructor(client: Client) {
    super(
      client,
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get the bots ping")
    );
  }

  public async run(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  }
}
