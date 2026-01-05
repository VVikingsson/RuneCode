<script setup>
// get endpoint for user info
import { BCol, BContainer, BImg, BRow } from 'bootstrap-vue-next'
import { ref, onMounted, computed } from 'vue'
import { Api } from '@/Api.js'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const defaultAvatar = 'https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0'
const avatarSrc = computed(() =>
  user.avatarUrl || defaultAvatar
)
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
      if (response.status !== 200) {
        // something went wrong
        error.value = response.data.message
        return
      }
      // raw data
      userData.value = response.data
    })
    .catch(err => {
      error.value = err.response?.data?.message || 'Failed to load user'
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
    {{ error }}
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
            :src="avatarSrc"
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
            <div class="easy">Skirmish</div>
            <div>{{userData.user.completed.easy}}</div>
          </div>
          <div>
            <div class="medium">Pillage</div>
            <div>{{userData.user.completed.medium}}</div>
          </div>
          <div>
            <div class="hard">Raid</div>
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
  flex: 5
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
.easy {
  color: var(--neon-cyan);
  text-shadow:
    0 0 2px var(--neon-cyan),
    0 0 0px var(--neon-cyan)
}
.medium {
  color: var(--neon-magenta);
  text-shadow:
    0 0 2px var(--neon-magenta),
    0 0 0px var(--neon-magenta)
}
.hard {
  color: var(--neon-orange);
  text-shadow:
    0 0 2px var(--neon-orange),
    0 0 0px var(--neon-orange)
}
p {
  text-align: left;
}
p.username {
  font-size: 20px;
  text-align: left;
}
</style>
