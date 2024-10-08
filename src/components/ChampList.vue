<script setup lang="ts">
import { Champions } from '../typescript/ChampionsType';

defineProps<{ champions: Champions[], isProposed: boolean, champion?: Champions }>();

const emit = defineEmits(['selectChampion']);

function onClickChampion(championName: string) {
  emit('selectChampion', championName);
}
</script>

<template>
  <ul :class="{ 'selectable' : !isProposed }">
    <li 
      v-for="(champion, index) in champions" 
      :key="index" 
      :class="{
        'correct': $props.champion?.id === champion.id && isProposed, 
        'incorrect': $props.champion?.id !== champion.id && isProposed
      }"
      @click="onClickChampion(champion.name)"
    >
      <img
        :src="'https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/' + champion.id +'.png'"
        :alt="champion.id + '_sprite'"
        width="40"
        height="40"
      />
      <p>{{ champion.name }}</p>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0;
    max-height: 420px;
  }

  .selectable {
    overflow-y: scroll;
  }

  li {
    list-style: none;
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 6px 16px;
    background-color: rgb(23, 23, 41);
    transition: background-color .3s;
    font-weight: 500;
  }
  
  .selectable li:hover {
    background-color: rgb(38, 38, 66);
    cursor: pointer;
  }

  .correct {
    background-color: rgb(34, 110, 19);
  }

  .incorrect {
    background-color: brown;
  }
</style>
