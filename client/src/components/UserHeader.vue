<script setup>
// get endpoint for user info
import { BCol, BContainer, BImg, BRow } from 'bootstrap-vue-next'
import { ref, onMounted, computed } from 'vue'
import { Api } from '@/Api.js'
// this is the version for common page view
const props = defineProps({
  id: { type: String, required: true }
})
const userData = ref(null)
const isLoading = ref(true)
const error = ref(null)

const totalSolved = computed(() => {
  return userData.value.completed.easy + userData.value.completed.medium + userData.value.completed.hard
})
// getting info for a specific user
function getUser(userID) {
  isLoading.value = true
  error.value = null
  Api.get('/users/' + userID)
    .then(response => {
      // raw data
      userData.value = response.data
    })
    .catch(error => {
      error.value = error
      userData.value = error
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  getUser(props.id)
})
</script>

<template>
  <div v-if="isLoading" class="text-center text-white">
    <BSpinner label="Loading..." variant="primary" />
    <p class="mt-2">Loading user's profile </p>
  </div>

  <BAlert v-else-if="error" show variant="danger">
    Error loading user data. Please try again.
  </BAlert>
  <!--  load this container if user data is loaded-->
  <BContainer
    v-else-if="userData"
    class="profile-header flex-wrap d-flex align-items-stretch rounded-3 gap-3 p-0"
    fluid
  >
    <BCol class="profile-col p-3 rounded-4">
      <BRow class="row-image">
        <BCol class="column-img px-4 py-2 text-start">
          <BImg
            src="https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0"
            alt="Image"
            height="120"
            width="120"
            rounded="circle"
          />
        </BCol>
      </BRow>
      <BRow class="text-start">
        <p class="username">{{userData.username}}</p>
        <p>Points {{ userData.points.toLocaleString('en-US') }}</p>
        <div>{{ userData.bio || 'You have no bio yet.' }}</div>
      </BRow>
    </BCol>

    <BCol class="challenge-stat-col p-3 rounded-4">
      <BRow class="h-100">
        <BCol class="chall-no-col d-flex flex-column justify-content-center">
          <div>{{totalSolved}}</div>
          <div>Challenges Mastered</div>
        </BCol>
        <BCol class="diff-col p-4 gap-4">
          <div>
            <div>Easy</div>
            <div>{{userData.completed.easy}}</div>
          </div>
          <div>
            <div>Medium</div>
            <div>{{userData.completed.medium}}</div>
          </div>
          <div>
            <div>Hard</div>
            <div>{{userData.completed.hard}}</div>
          </div>
        </BCol>
      </BRow>
    </BCol>
  </BContainer>
  <BAlert v-else show variant="warning">
    User profile not found.
  </BAlert>
</template>

<style scoped>
.main-con {
  width: 90%;
}
.profile-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
}

.challenge-stat-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
  flex: 2;
}
.chall-no-col {
  flex: 2
}
.diff-col {
  display: flex;
  flex-direction: column;
}
.diff-col > * {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  border-radius: 16px;
  background-color: var(--light-blue);
}

p {
  text-align: left;
}
p.username {
  font-size: 20px;
  text-align: left;
}
</style>
