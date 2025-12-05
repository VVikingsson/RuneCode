<template>
  <WelcomeContainer></WelcomeContainer>
</template>

<script setup>
// @ is an alias to /src
import { Api } from '@/Api'
import { ref } from 'vue'
import WelcomeContainer from '../components/WelcomeContainer.vue';

</script>

<script>
export default {
  name: 'home'
}
</script>

<style scoped>
.btn_message {
  margin-bottom: 1em;
  background-color: orange;
  height: 500px;
}
</style>
