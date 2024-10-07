<script setup lang="ts">
import { Champions } from '../App.vue';

defineProps<{ filteredChampions: Champions[] }>();
</script>

<template>
  <ul>
      <li v-for="(champion, index) in filteredChampions" :key="index">
        {{ champion.name }}
        <img
          :src="'https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/' + champion.id +'.png'"
          :alt="champion.id + '_sprite'"
          width="40"
          height="40"
        />
      </li>
    </ul>
</template>

<style scoped>
  
</style>