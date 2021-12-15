import dotenv from "dotenv";
import Client from "./Client";

dotenv.config();

const client = new Client({
  intents: ["GUILD_MESSAGES"],
});

client.login(process.env.TOKEN);
