import { createClient } from "@supabase/supabase-js";
import { Client } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({ intents: 0 });
export const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

client.on("ready", (client) => {
  console.log(`Logged as ${client.user.username}.`);
});

client.on("interactionCreate", async (interaction) => {
  let cmd;
  if (interaction.isAutocomplete()) {
    cmd = await import(`./commands/autocomplete/${interaction.commandName}.js`);
  }
  if (interaction.isCommand()) {
    cmd = await import(`./commands/slash/${interaction.commandName}.js`);
  }

  cmd.default(interaction);
});

client.login(process.env.TOKEN);
