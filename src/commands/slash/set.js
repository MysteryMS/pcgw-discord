import { CommandInteraction } from "discord.js";
import { supabaseClient } from "../../index.js";

/**
 * @type { (interaction: CommandInteraction) => void }
 */
const run = async (interaction) => {
  if (interaction.options.data[0].name == "preferred_platform") {
    const platform = interaction.options.data[0].options[0].value;
    const { error } = await supabaseClient
      .from("preferences")
      .upsert({ id: interaction.user.id, preferredPlatform: platform })
      .eq("id", interaction.user.id);

    let content = "";

    if (error) {
      content = "An error ocurred. Your preferences hasn't been changed.";
    } else {
      content = "Your preferred platform is now " + platform;
    }

    interaction.reply({ ephemeral: true, content });
  }

  if (interaction.options.data[0].name == "preferred_language") {
    const lang = interaction.options.data[0].options[0].value;
    const { error } = await supabaseClient
      .from("preferences")
      .upsert({ id: interaction.user.id, preferredLanguage: lang })
      .eq("id", interaction.user.id);

    if (error) console.log(error);
    let content = "";

    if (error) {
      content = "An error ocurred. Your preferences hasn't been changed.";
    } else {
      content = "Your preferred language is now " + lang;
    }

    interaction.reply({ ephemeral: true, content });
  }
};

export default run;
