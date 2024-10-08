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
const inputRef = ref<HTMLInputElement | null>(null);
const splashartXPos = ref(getRandomNum(-190, 18));
const splashartYPos = ref(getRandomNum(-16, 16));
const splashartScale = ref(6);

function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getRandomNum(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function verifyAnswer () {
  if(answer.value.toLowerCase() === champion.value.name.toLowerCase()) {
    addChampionToProposed(answer.value)
    isContinue.value = false
  } else if (answer.value.toLowerCase() !== champion.value.name.toLowerCase()) {
    addChampionToProposed(answer.value)
    removeChampionFromSelectable(answer.value)
    forceFocus()
  }
  answer.value = ''
}

function filterChampions() {
  filteredChampions.value = remainedChampions.value.filter(champ => 
    champ.name.toLowerCase().includes(answer.value.toLowerCase())
  );
}

function startNewGame() {
  splashartXPos.value = getRandomNum(-190, 18);
  splashartYPos.value = getRandomNum(-16, 16);
  splashartScale.value = 6
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
  forceFocus()
}

function addChampionToProposed (name: string) {
  const champ = remainedChampions.value.filter((champion) => champion.name.toLowerCase() === name.toLowerCase())
  proposedChampions.value.unshift(champ[0])
}

function removeChampionFromSelectable (name:string) {
  remainedChampions.value = remainedChampions.value.filter((champion) => champion.name.toLowerCase() !== name.toLowerCase())
}

function onClick (selectedChampionName: string) {
  if (selectedChampionName.toLowerCase() === champion.value.name.toLowerCase()) {
    addChampionToProposed(selectedChampionName)
    isContinue.value = false
    splashartScale.value = 1
    splashartXPos.value = 0
    splashartYPos.value = 0
  } else {
    addChampionToProposed(selectedChampionName)
    removeChampionFromSelectable(selectedChampionName)
    let scale = splashartScale.value;
    if (scale > 1.2) splashartScale.value = (scale - scale * 0.1);
    forceFocus()
  }
  answer.value = ''
}

function forceFocus() {
  if (inputRef.value) {
    inputRef.value.focus();
  }
}

onMounted(() => {
  startNewGame()
  forceFocus()
});
</script>

<template>
  <div class="game">
    <h2>Guess who ?</h2>
    <div class="reload">
      <img @click="startNewGame" src="../assets/reload.svg" alt="reload" width="32">
    </div>
    <div class="zoomed-img">
      <img 
      :src="'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+ champion.id + '_' + skin +'.jpg'"
      :alt="skin+'_id'"
      :class="isContinue ? 'splashart': 'revealed'"
      :style="{
        'object-position': splashartXPos + 'px ' + splashartYPos + 'px',
        'transform': 'scale(' + splashartScale + ')'
      }"
      />
    </div>
    <div class="sub" v-if="isContinue">
      <input v-model="answer" ref="inputRef" @input="filterChampions" placeholder="Rechercher un champion" />
      <button @click="verifyAnswer">Valider</button>
    </div>
    <div v-else>
      <p>GG WP!</p>
    </div>

    <div class="selectable" v-if="answer.length > 0">
      <ChampList :champions="filteredChampions" :isProposed="false" @selectChampion="onClick"/>
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

.zoomed-img {
  margin: 0 auto;
  min-width: 252px;
  min-height: 252px;
  max-width: 252px;
  max-height: 252px;
  width: fit-content;
  height: fit-content;
  overflow: hidden;
  border-radius: 8px;
  border: #1a1a1a 5px solid;
  display: flex;
  align-items: center;
}

.zoomed-img:has(.revealed) {
  border: 0;
  border-radius: 0;
  max-width: 415px;
  overflow:visible;
}

.splashart {
  width: 252px;
  height: 252px;
  object-fit: cover;
}

.revealed{
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: #1a1a1a 5px solid;
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
