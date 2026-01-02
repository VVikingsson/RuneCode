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
  return userData.value.user.completed.easy + userData.value.user.completed.medium + userData.value.user.completed.hard
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
  <div
    v-else-if="userData?.user"
    class="profile-header"
  >
    <BCol class="profile-col p-3">
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
        <p class="username">{{userData.user.username}}</p>
        <p>Points {{ userData.user.points?.toLocaleString('en-US') || 0}}</p>
        <div>{{ userData.user.bio || 'You have no bio yet.' }}</div>
      </BRow>
    </BCol>

    <BCol class="challenge-stat-col p-3">
      <BRow class="h-100">
        <BCol class="chall-no-col d-flex flex-column justify-content-center">
          <div>{{totalSolved}}</div>
          <div>Challenges Mastered</div>
        </BCol>
        <BCol class="diff-col p-4 gap-4">
          <div>
            <div>Easy</div>
            <div>{{userData.user.completed.easy}}</div>
          </div>
          <div>
            <div>Medium</div>
            <div>{{userData.user.completed.medium}}</div>
          </div>
          <div>
            <div>Hard</div>
            <div>{{userData.user.completed.hard}}</div>
          </div>
        </BCol>
      </BRow>
    </BCol>
  </div>
  <BAlert v-else show variant="warning">
    User profile not found.
  </BAlert>
</template>

<style scoped>
.main-con {
  width: 90%;
}
.profile-header {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 22px;
}
.profile-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
  border-radius: 16px;
}

.challenge-stat-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
  flex: 2;
  border-radius: 16px;
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
  border-radius: 12px;
  background-color: var(--light-blue-vague);
}

p {
  text-align: left;
}
p.username {
  font-size: 20px;
  text-align: left;
}
</style>
