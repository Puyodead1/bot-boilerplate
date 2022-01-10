import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Client from "./Client";

export default abstract class BaseCommand {
  private _data: SlashCommandBuilder;

  constructor(
    protected client: Client,
    data: SlashCommandBuilder,
    protected readonly path: string
  ) {
    this._data = data;
  }

  get data(): SlashCommandBuilder {
    return this._data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract run(interaction: CommandInteraction): any;

  public unloadCommand() {
    const mod = require.cache[require.resolve(this.path.split(".js")[0])];
    if (!mod || !mod.parent) return;
    delete require.cache[require.resolve(this.path)];

    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
  }
}
