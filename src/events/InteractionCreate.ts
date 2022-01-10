import { CommandInteraction } from "discord.js";
import BaseEvent from "../BaseEvent";
import Client from "../Client";

export default class UserEvent extends BaseEvent {
  constructor(client: Client) {
    super(client, {
      name: "interactionCreate",
      once: false,
    });
  }

  public async run(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    if (!interaction.member)
      return interaction.reply({
        content: "Failed to get member",
      });

    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      this.client.logger.info(
        `[InteractionCreateEvent] ${interaction.member.user.username}#${interaction.member.user.discriminator} (${interaction.member.user.id}) ran command ${command.data.name}`
      );
      await command.run(interaction);
    } catch (e) {
      this.client.logger.error(
        `[InteractionCreateEvent] Failed to run command ${command.data.name}: ${e}`
      );
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}
