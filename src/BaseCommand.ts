import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Client from "./Client";

export default abstract class BaseCommand {
  private _data: SlashCommandBuilder;

  constructor(protected client: Client, data: SlashCommandBuilder) {
    this._data = data;
  }

  get data(): SlashCommandBuilder {
    return this._data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract run(interaction: CommandInteraction): any;
}
