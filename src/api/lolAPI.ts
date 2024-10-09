import axios from "axios";
import { Champions } from "../typescript/ChampionsType";

const versionUrl = "https://ddragon.leagueoflegends.com/api/versions.json";

async function getVersion() {
  try {
    const response = await axios.get(versionUrl);
    const version = response.data[0];
    return version;
  } catch (error) {
    console.error("Error retrieving the version:", error);
  }
}

export async function getChampions() {
  try {
    const version = await getVersion();

    if (!version) {
      console.error("The version could not be retrieved.");
      return;
    }

    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
    );
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
    console.error("Error retrieving champions:", error);
  }
}
