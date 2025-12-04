<script setup>
import { Api } from '@/Api'
import { ref, onMounted } from 'vue'
// select certain attributes from the response that we receive(for leaderboard we need username and points)
const items = ref([])
function getTopUsers() {
  Api.get('/leaderboard')
    .then(response => {
      // raw data
      const users = response.data.leaderboard
      // parsed attributes
      items.value = users.map((user) => {
        return {
          username: user.username,
          points: user.points
        }
      })
    })
    .catch(error => {
      items.value = error
    })
}

onMounted(() => {
  getTopUsers()
})

// optional: make "up" error to scroll back to the beginning
</script>

<template>
  <div>
    <br>
    <br>
    <BCard class="leaderboard-card">
      <BTable
        hover
        :items="items"
        class="my-table text-start"
      />
    </BCard>
  </div>
</template>

<style scoped>
.leaderboard-card {
  background-color: var(--section-bg);
  width: 90%;
  box-sizing: border-box;
  margin: auto;
  padding: 0.7em;
}
.my-table :deep(td),
.my-table :deep(th) {
  background-color: var(--section-bg);
  color: white;
}

</style>
