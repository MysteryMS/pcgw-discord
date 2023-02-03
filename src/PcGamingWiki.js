import axios from "axios";

const BASE_ENDPOINT = "https://www.pcgamingwiki.com/w/api.php";

export default class PcGamingWiki {
  /**
   * @param {String} query
   */
  static async search(query) {
    const params = {
      action: "query",
      format: "json",
      prop: "links",
      list: "search",
      srsearch: query,
      srsort: "relevance",
      srwhat: "title"
    };
    const req = await axios.get(BASE_ENDPOINT, { params });
    return req.data.query;
  }

  /**
   *
   * @param {String} gameId
   */
  static async getGameInfo(gameId) {
    const infoboxCargoFields = [
        "Infobox_game._pageName = Page",
        "Infobox_game.Cover_URL",
        "Infobox_game.Steam_AppID",
        "Infobox_game.Available_on",
        "Infobox_game.Developers"
    ]

    const params = {
        action: "cargoquery",
        tables: "Infobox_game",
        fields: infoboxCargoFields.join(', '),
        where: "Infobox_game._pageID = " + gameId,
        format: "json"
    }
    const req = await axios.get(BASE_ENDPOINT, { params })
    return req.data.cargoquery?.[0]?.title
  }

  static async getInputInfo(pageId) {
    const inputCargoFields = [
        "Input.Controller_support",
        "Input.Full_controller_support",
        "Input.Controller_remapping",
        "Input.XInput_controller_support",
        "Input.Xbox_One_Impulse_Triggers",
        "Input.Controller_haptic_feedback",
        "Input.Steam_Controller_prompts",
        "Input.DualShock_4_connection_modes",
        "Input.Xbox_prompts",
        "Input.DualShock_4_controller_support",
        "Input.DualShock_prompts",
        "Input.DualShock_4_light_bar_support",
        "Input.DualShock_4_connection_modes",
        "Input.Steam_Input_API_support"
    ]

    const params = {
        format: "json",
        action: "cargoquery",
        tables: "Input",
        fields: inputCargoFields.join(', '),
        where: "Input._pageID = " + pageId
    }

   const req = await axios.get(BASE_ENDPOINT, { params })
   //if (!req.data.cargoquery) return undefined
   return req.data.cargoquery?.[0]?.title
  }

  static async getl10n(pageId) {
    const l10nCargoFields = [
        "L10n.Language",
        "L10n.Interface",
        "L10n.Audio",
        "L10n.Subtitles"
    ]
    const params = {
        format: "json",
        action: "cargoquery",
        tables: "L10n",
        fields: l10nCargoFields.join(', '),
        where: "L10n._pageID = " + pageId
    }
    const req = await axios.get(BASE_ENDPOINT, { params })
    //if (!req.data.cargoquery) return undefined
    return req.data.cargoquery?.reduce((ac, { title }) => ([...ac, title ]), [])
  }
}
