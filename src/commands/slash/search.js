import { CommandInteraction, EmbedBuilder } from "discord.js";
import PcGamingWiki from "../../PcGamingWiki.js";
import Vibrant from "node-vibrant";
import Utils, { LanguageCodes, LanguageEmoji } from "../../Utils.js";
import { supabaseClient } from "../../index.js";

/***
 * @type { (interaction: CommandInteraction) => void }
 */
const run = async (interaction) => {
  interaction.deferReply();
  const pageId = interaction.options.get("query", true).value;
  const inputInfo = await PcGamingWiki.getInputInfo(pageId);
  const gameInfo = await PcGamingWiki.getGameInfo(pageId);
  const l10nInfo = await PcGamingWiki.getl10n(pageId);
  const l10nEnglish = l10nInfo?.find((o) => o?.Language == "English");

  const { data } = await supabaseClient
    .from("preferences")
    .select()
    .eq("id", interaction.user.id);

  const preferredPlatform = data[0]?.preferredPlatform;
  const preferredLang = data[0]?.preferredLanguage;
  const preferredL10n = l10nInfo?.filter(
    (o) => o.Language == LanguageCodes[preferredLang]
  )[0];

  if (!inputInfo && !gameInfo) {
    return interaction.editReply({ content: "No matches found." });
  }

  let description = "";
  const color = (await Vibrant.from(gameInfo["Cover URL"]).getPalette()).Vibrant
    .hex;
  const platforms = gameInfo["Available on"].split(",");

  if (platforms.includes("Windows")) {
    description += "✅ Available on Windows";
  } else {
    description += "❌ Not available on Windows";
  }

  if (preferredPlatform != "Windows" && preferredPlatform) {
    if (platforms.includes(preferredPlatform)) {
      description += `\n✅ Available on ${preferredPlatform}`;
    } else {
      description += `\n❌ Not available on ${preferredPlatform}`;
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(gameInfo["Page"])
    .setThumbnail(gameInfo["Cover URL"])
    .setColor(color)
    .setDescription(description);

  const controllerSupport = inputInfo["Controller support"];
  if (inputInfo) {
    const ds4 = inputInfo["DualShock 4 controller support"];
    const xbox = inputInfo["XInput controller support"];

    let supportStr = `${Utils.emojiFor(controllerSupport)} ${Utils.labelFor(
      controllerSupport
    )}`;
    let ds4Str = `${Utils.emojiFor(ds4)} ${Utils.labelFor(ds4)}`;
    let xboxStr = `${Utils.emojiFor(xbox)} ${Utils.labelFor(xbox)}`;
    let steamStr = "";

    if (inputInfo["Full controller support"] === "true") {
      supportStr += `\n${Utils.emojiFor(
        inputInfo["Full controller support"]
      )} Full support`;
    }
    if (inputInfo["Controller support"] == "true") {
      supportStr += `\n${Utils.emojiFor(
        inputInfo["Controller remapping"]
      )} Remapping`;
      supportStr += `\n${Utils.emojiFor(
        inputInfo["Controller sensitivity"]
      )} Sensitivity`;
      supportStr += `\n${Utils.emojiFor(
        inputInfo["Controller Y-axis inversion"]
      )} Y-axis inversion`;
      supportStr += `\n${Utils.emojiFor(
        inputInfo["Controller haptic feedback"]
      )} Haptic feedback (vibration)`;
    }

    if (ds4 === "true" || ds4 === "hackable") {
      ds4Str += `\n${Utils.emojiFor(
        inputInfo["DualShock prompts"]
      )} Button prompts`;
      ds4Str += `\n${Utils.emojiFor(
        inputInfo["DualShock 4 light bar support"]
      )} Lightbar`;
      ds4Str += `\nConnection modes: ${inputInfo["DualShock 4 connection modes"]
        .split(",")
        .join(", ")}`;
    }

    if (xbox === "true") {
      xboxStr += `\n${Utils.emojiFor(
        inputInfo["Xbox prompts"]
      )} Button prompts`;
      xboxStr += `\n${Utils.emojiFor(
        inputInfo["Xbox One Impulse Triggers"]
      )} Xbox One impulse triggers`;
    }

    steamStr += `${Utils.emojiFor(
      inputInfo["Steam Input API support"]
    )} Steam input`;
    steamStr += `\n${Utils.emojiFor(
      inputInfo["Steam Input presets"]
    )} Input presets`;

    const supportField = {
      name: "🎮 Controller support",
      value: supportStr,
    };

    const ds4Field = {
      name: "DualShock 4 support",
      value: ds4Str,
      inline: true,
    };

    const xboxField = {
      name: "Xbox controller support",
      value: xboxStr,
      inline: true,
    };

    const steamField = {
      name: "Steam",
      value: steamStr,
      inline: true,
    };

    embed.addFields(supportField);

    if (controllerSupport == "true") {
      embed.addFields(ds4Field, xboxField, steamField);
    }
  }

  if (l10nInfo) {
    let count = 1;
    let l10nStr =
      `🇺🇸 ` +
      Utils.emojiFor(l10nEnglish.Interface) +
      "|" +
      Utils.emojiFor(l10nEnglish.Audio) +
      "|" +
      Utils.emojiFor(l10nEnglish.Subtitles);

    if (preferredLang) {
      if (preferredL10n) count++;
      const flag = LanguageEmoji[preferredLang];
      l10nStr +=
        `\n${flag} ` +
        Utils.emojiFor(preferredL10n?.Interface, "❌") +
        "|" +
        Utils.emojiFor(preferredL10n?.Audio, "❌") +
        "|" +
        Utils.emojiFor(preferredL10n?.Subtitles, "❌");

      if (!preferredL10n) {
        const similarLangCode = Utils.findSimilarLanguage(preferredLang);
        const similarL10n = l10nInfo.find((l) => l.Language === LanguageCodes[similarLangCode]);
        if (similarLangCode && similarL10n) {
          count++;
          const flag = LanguageEmoji[similarLangCode];
          l10nStr +=
            `\n${flag} ` +
            Utils.emojiFor(similarL10n?.Interface, "❌") +
            "|" +
            Utils.emojiFor(similarL10n?.Audio, "❌") +
            "|" +
            Utils.emojiFor(similarL10n?.Subtitles, "❌") +
            " (similar)";
        }
      }
    }

    l10nStr += `\n+ ${l10nInfo.length - count} more`;

    const localizationField = {
      name: "Languages (UI|Audio|Sub)",
      value: l10nStr,
      inline: true,
    };
    embed.addFields(localizationField);
  }

  const steamAppId = gameInfo["Steam AppID"].split(",")[0];
  const firstRow = [];
  const pcgwUrl = `https://www.pcgamingwiki.com/api/appid.php?appid=${steamAppId}`;
  const steamUrl = `https://store.steampowered.com/app/${steamAppId}`;
  if (gameInfo["Steam AppID"]) {
    embed.setURL(pcgwUrl);
    firstRow.push({ type: 2, style: 5, url: steamUrl, label: "Steam page" });
  }

  interaction.editReply({
    embeds: [embed],
    components: [{ components: firstRow }],
  });
};

export default run;
