<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { Champions } from '../App.vue';
import ChampList from '../components/ChampList.vue';

const props = defineProps<{ champions: Champions[] }>();

const champion = ref<Champions>({
  id: '', name: '', skins: [],
  value: undefined
});
const filteredChampions = ref<Champions[]>([]);
const skin = ref('')
const answer = ref('')
const isContinue = ref(true)

function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function verifyAnswer () {
  if(answer.value.toLowerCase() === champion.value.name.toLowerCase()) {
    isContinue.value = false
  }
  answer.value = ''
}

function filterChampions() {
  filteredChampions.value = props.champions.filter(champ => 
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
  isContinue.value = true
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

    <div v-if="answer.length > 0">
      <ChampList :filteredChampions="filteredChampions"/>
    </div>
  </div>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub {
  display: flex;
  justify-content: space-between;
}

.reload {
  display: flex;
  justify-content: end;
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
  width: 400px;
  font-size: 1.5rem;
  padding:0 8px;
}
</style>
