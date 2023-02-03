export default class Utils {
  static emojiFor(value, fallback = "❔") {
    if (value == "true") {
      return "✅";
    } else if (value == "false") {
      return "❌";
    } else if (value == "hackable") {
      return "🔧";
    } else if (value == "n/a") {
      return "⛔";
    } else return fallback;
  }

  static labelFor(value) {
    if (value == "true") {
      return "Yes";
    } else if (value == "false") {
      return "No";
    } else if (value == "hackable") {
      return "Hackable";
    } else if (value == "n/a") {
      return "N/A";
    } else return "Unknown";
  }

  static findSimilarLanguage(originalLanguage) {
    const similarLanguages = {
      "en-US": "en-US",
      "en-GB": "en-US",
      "pt-BR": "pt-PT",
      "pt-PT": "pt-BR",
      "zh-CN": "zh-TW",
      "zh-TW": "zh-CN",
      "nb-NO": "nn-NO",
      "nn-NO": "nb-NO",
    };
    return similarLanguages[originalLanguage];
  }
}

export const LanguageCodes = {
  "en-US": "English",
  "de-DE": "German",
  "fr-FR": "French",
  "ru-RU": "Russian",
  "es-ES": "Latin America Spanish",
  "pt-BR": "Brazilian Portuguese",
  "pt-PT": "Portuguese",
  "it-IT": "Italian",
  "ja-JP": "Japanese",
  "ko-KR": "Korean",
  "zh-CN": "Simplified Chinese",
  "zh-TW": "Traditional Chinese",
  "pl-PL": "Polish",
  "tr-TR": "Turkish",
  "ar-SA": "Arabic",
  "th-TH": "Thai",
  "id-ID": "Indonesian",
  "nl-NL": "Dutch",
  "sv-SE": "Swedish",
  "nb-NO": "Norwegian",
  "fi-FI": "Finnish",
  "da-DK": "Danish",
  "hu-HU": "Hungarian",
  "cs-CZ": "Czech",
  "el-GR": "Greek",
  "ro-RO": "Romanian",
};

export const LanguageEmoji = {
  "en-US": "🇺🇸",
  "de-DE": "🇩🇪",
  "fr-FR": "🇫🇷",
  "ru-RU": "🇷🇺",
  "es-ES": "🇪🇸",
  "pt-BR": "🇧🇷",
  "pt-PT": "🇵🇹",
  "it-IT": "🇮🇹",
  "ja-JP": "🇯🇵",
  "ko-KR": "🇰🇷",
  "zh-CN": "🇨🇳",
  "zh-TW": "🇹🇼",
  "pl-PL": "🇵🇱",
  "tr-TR": "🇹🇷",
  "ar-SA": "🇸🇦",
  "th-TH": "🇹🇭",
  "id-ID": "🇮🇩",
  "nl-NL": "🇳🇱",
  "sv-SE": "🇸🇪",
  "nb-NO": "🇳🇴",
  "fi-FI": "🇫🇮",
  "da-DK": "🇩🇰",
  "hu-HU": "🇭🇺",
  "cs-CZ": "🇨🇿",
  "el-GR": "🇬🇷",
  "ro-RO": "🇷🇴",
};
