<template>
  <div>
    <b-container fluid>
      <h1 class="display-5 fw-bold">DIT342 Frontend</h1>
      <p class="fs-4">Welcome to your DIT342 Frontend Vue.js App</p>
      <b-button class="btn_message" v-on:click="getMessage()" >Get Message from Server</b-button>
      <p class="col-xl-9">Message from the server:<br/>
      {{ message }}</p>
    </b-container>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { Api } from '@/Api'
import { ref } from 'vue'
const message = ref('none')
function getMessage() {
  Api.get('/')
    .then(response => {
      message.value = response.data.message
    })
    .catch(error => {
      message.value = error
    })
}
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
