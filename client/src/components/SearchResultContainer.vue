<template>
  <div v-if="users" class="search-result-container">
  <BListGroup>
    <SearchResultUser v-for="user in users" :user="user"/>
  </BListGroup>
  </div>
</template>


<script setup>
import { defineProps } from 'vue';
import SearchResultUser from './SearchResultUser.vue'

const props = defineProps({
  users: Array
})
</script>


<style scoped>
  .search-result-container {
    border: 2px white solid;
    padding: 1rem;
    border-radius: 8px;
  }
</style>