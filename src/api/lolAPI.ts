import axios from "axios";
import { Champions } from "../typescript/ChampionsType";

const url =
  "https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion.json";

export async function getChampions() {
  try {
    const response = await axios.get(url);
    const championsData = response.data.data;
    let championsList: Champions[] = [];

    const promises = Object.keys(championsData).map(async (key) => {
      const champResponse = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion/${championsData[key].id}.json`
      );
      const champSkins: any = [];

      champResponse.data.data[championsData[key].id].skins.map((key: any) => {
        let skinId = key.id;
        if (skinId.length === 6) {
          skinId = skinId.substr(-3);
          skinId = skinId.replace(/^0+(?=.)/, "");
          if (skinId === "") skinId = "0";
          champSkins.push(skinId);
        } else {
          skinId = skinId.substr(-3);
          skinId = skinId.replace(/^0+(?=.)/, "");
          if (skinId === "") skinId = "0";
          champSkins.push(skinId);
        }
      });

      const champion: Champions = {
        id: championsData[key].id,
        name: championsData[key].name,
        skins: champSkins,
        value: undefined,
      };

      championsList.push(champion);
    });

    await Promise.all(promises);
    return championsList;
  } catch (error) {
    console.error("Erreur lors de la récupération des champions:", error);
  }
}
