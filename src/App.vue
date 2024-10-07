<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Game from './components/Game.vue';
import axios from 'axios';

export type Champions = {
  value: Champions[] | undefined;
  id: string;
  name: string;
  skins: string[];
};

// URL du fichier JSON contenant les champions
const url = 'https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion.json';

// Déclaration d'un ref pour les champions
const champions = ref<Champions[]>([]);

// Fonction pour récupérer les noms des champions via Axios
async function getChampions() {
  try {
    const response = await axios.get(url);
    const championsData = response.data.data;
    let championsList: Champions[] = [];

    const promises = Object.keys(championsData).map(async (key) => {
      const champResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/champion/${championsData[key].id}.json`);
      const champSkins : any = []

      champResponse.data.data[championsData[key].id].skins.map((key: any) => {
        let skinId = key.id
        if(skinId.length === 6){
          skinId = skinId.substr(-3)
          skinId = skinId.replace(/^0+(?=.)/, '')
          if (skinId === '') skinId = '0'
          champSkins.push(skinId)
        }else{
          skinId = skinId.substr(-3)
          skinId = skinId.replace(/^0+(?=.)/, '')
          if (skinId === '') skinId = '0'
          champSkins.push(skinId)
        }
      })

      const champion: Champions = {
        id: championsData[key].id,
        name: championsData[key].name,
        skins: champSkins,
        value: undefined
      };

      championsList.push(champion);
    });

    // Attendre que toutes les promesses soient résolues
    await Promise.all(promises);
    champions.value = championsList; // Mettre à jour champions avec la liste finale
  } catch (error) {
    console.error('Erreur lors de la récupération des champions:', error);
  }
}

// Appeler la fonction lors du montage du composant
onMounted(() => {
  getChampions();
});
</script>

<template>
  <div>
    <h1>Guess the champion</h1>
    <!-- Passer la liste des champions au composant Game -->
    <div v-if="champions.length > 0">
      <Game :champions="champions" />
    </div>
    <div v-else>
      <h3>Chargement...</h3>
    </div>
  </div>
</template>

<style scoped>
body {
  margin-left: auto;
  margin-right: auto;
}
</style>
