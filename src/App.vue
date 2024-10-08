<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Game from './components/Game.vue';
import { getChampions } from './api/lolAPI';
import { Champions } from './typescript/ChampionsType';

const champions = ref<Champions[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await getChampions();
    if (response) {
      champions.value = response;
    } else {
      console.error('Failed to fetch champions');
    }
  } catch (error) {
    console.error('Error occurred while fetching champions:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <h1>Guess the champion</h1>
    <div v-if="!isLoading">
      <div v-if="champions.length > 0">
        <Game :champions="champions" />
      </div>
      <div v-else>
        <h3>No champions found</h3>
      </div>
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
