<template>
  <div id="app">
    <div id="nav">
      <NavBar v-if="router.currentRoute.value.name != 'SignIn'"></NavBar>
    </div>

    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
