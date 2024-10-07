<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { Champions } from '../App.vue';
import ChampList from '../components/ChampList.vue';

const props = defineProps<{ champions: Champions[] }>();

const champion = ref<Champions>({
  id: '', name: '', skins: [],
  value: undefined
});
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
}

const filteredChampions = ref<Champions[]>([]);

function filterChampions() {
  filteredChampions.value = props.champions.filter(champ => 
    champ.name.toLowerCase().includes(answer.value.toLowerCase())
  );
}

onMounted(() => {
  const randomChampion = getRandomElement(props.champions);
  if (randomChampion) {
    champion.value = randomChampion;
    const randomSkin = getRandomElement(randomChampion.skins);
    if (randomSkin) {
      skin.value = randomSkin;
    }
  }
});
</script>

<template>
  <div class="game">
    <h2>Guess who ?</h2>
    <img 
    :src="'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+ champion.id + '_' + skin +'.jpg'"
    :alt="skin+'_id'"
    width="550"
    />
    <div class="sub">
      <input v-model="answer" @input="filterChampions" placeholder="Rechercher un champion" />
      <button @click="verifyAnswer">Valider</button>
    </div>
    <p>{{ isContinue }}</p>

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

input {
  height: 45px;
  width: 400px;
  font-size: 1.5rem;
  padding:0 8px;
}
</style>
