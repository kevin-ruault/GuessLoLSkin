<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Champions } from '../App.vue';
import ChampList from '../components/ChampList.vue';

const props = defineProps<{ champions: Champions[] }>();

const champion = ref<Champions>({
  id: '', name: '', skins: [],
  value: undefined
});
const filteredChampions = ref<Champions[]>([]);
const skin = ref('');
const answer = ref('');
const isContinue = ref(true);
const remainedChampions = ref<Champions[]>(props.champions);
const proposedChampions = ref<Champions[]>([])

function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function verifyAnswer () {
  if(answer.value.toLowerCase() === champion.value.name.toLowerCase()) {
    addChampionToProposed(answer.value)
    isContinue.value = false
  } else if (answer.value.toLowerCase() !== champion.value.name.toLowerCase()) {
    addChampionToProposed(answer.value)
    removeChampionFromSelectable(answer.value)
  }
  answer.value = ''
}

function filterChampions() {
  filteredChampions.value = remainedChampions.value.filter(champ => 
    champ.name.toLowerCase().includes(answer.value.toLowerCase())
  );
}

function startNewGame() {
  const randomChampion = getRandomElement(props.champions);
  if (randomChampion) {
    champion.value = randomChampion;
    const randomSkin = getRandomElement(randomChampion.skins);
    if (randomSkin) {
      skin.value = randomSkin;
    }
  }
  remainedChampions.value = props.champions
  proposedChampions.value = []
  isContinue.value = true
}

function addChampionToProposed (name: string) {
  const champ = remainedChampions.value.filter((champion) => champion.name.toLowerCase() === name.toLowerCase())
  proposedChampions.value.unshift(champ[0])
}

function removeChampionFromSelectable (name:string) {
  remainedChampions.value = remainedChampions.value.filter((champion) => champion.name.toLowerCase() !== name.toLowerCase())
}

function onClick (event: string) {
  if (event.toLowerCase() !== champion.value.name.toLowerCase()) {
    removeChampionFromSelectable(event)
  }
}

onMounted(() => {
  startNewGame()
});
</script>

<template>
  <div class="game">
    <h2>Guess who ?</h2>
    <div class="reload">
      <img @click="startNewGame" src="../assets/reload.svg" alt="reload" width="32">
    </div>
    <img 
    :src="'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+ champion.id + '_' + skin +'.jpg'"
    :alt="skin+'_id'"
    width="550"
    />
    <div class="sub">
      <input v-model="answer" @input="filterChampions" placeholder="Rechercher un champion" />
      <button @click="verifyAnswer">Valider</button>
    </div>
    <p v-if="!isContinue">Bien joué !</p>

    <div class="selectable" v-if="answer.length > 0">
      <ChampList :champions="filteredChampions" :isProposed="false"/>
    </div>
  </div>
  <div class="proposed">
    <ChampList :champions="proposedChampions" :isProposed="true" :champion="champion"/>
  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.sub {
  display: flex;
  justify-content: space-between;
}

.reload {
  display: flex;
  justify-content: end;
}

.selectable {
  position: absolute;
  width: 100%;
  top: 102%;
  left: 0;
  z-index: 100;
}

.reload img {
  border-radius: 150%;
  border: 1px solid transparent;
  padding: 8px;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  }

.reload img:hover {
  border-color: #646cff;
}

input {
  height: 45px;
  width: 280px;
  font-size: 1.5rem;
  padding:0 8px;
}
</style>
