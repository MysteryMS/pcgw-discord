import { AutocompleteInteraction } from "discord.js";
import PcGamingWiki from "../../PcGamingWiki.js";

/***
 * @type { (interaction: AutocompleteInteraction) => void }
 */
const run = async (interaction) => {
  const query = interaction.options.getString("query");
  if (!query) return;

  let res = await PcGamingWiki.search(query);
  if (!res?.search?.length) return;

  const games = res.search.map((o) => {
    return { name: o.title, value: o.pageid.toString() };
  });

  interaction.respond(games);
};

export default run;
