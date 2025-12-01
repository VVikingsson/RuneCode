<template>
  <div id="app">
    <div id="nav">
      <NavBar></NavBar>
    </div>

    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-blue);
}
</style>
