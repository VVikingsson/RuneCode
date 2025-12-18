<script setup>
import {BCard, BCardImg, BCol, BContainer, BImg, BRow, BTab, BTabs} from "bootstrap-vue-next";
import { ref } from 'vue'
import UserHeader from '../components/UserHeader.vue'
import UserSolutions from '../components/UserSolutions.vue'

const props = defineProps({
  id: { type: String, required: true }
})

</script>

<template>
  <div class="div1">
    <BContainer fluid class="main-con p-2 mt-3 d-flex flex-column gap-5">
<!-- user header, two upper containers-->
      <UserHeader :id="props.id" />
<!-- submissions container -->
      <UserSolutions :id="props.id" />
    </BContainer>
  </div>

</template>

<style scoped>

.main-con {
  width: 90%;
}

</style>
