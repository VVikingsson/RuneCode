<script setup>
import { Api } from '@/Api'
import { ref, onMounted } from 'vue'

const currentUser = ref(null);
// this is the attributes that will be displayed
const fields = [
  { key: 'username', label: 'User' },
  { key: 'points', label: 'Points' }
]
const items = ref([])
function getTopUsers() {
  Api.get('/leaderboard')
    .then(response => {
      // raw data
      const users = response.data.leaderboard
      // parsed attributes
      items.value = users.map((user) => {
        return {
          id: user._id, // it is included in the items but is not displayed in the table
          username: user.username,
          points: user.points
        }
      });

      currentUser.value = response.data.currentUser;
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
        :fields="fields"
        class="my-table text-start"
      >
        <template #cell(username)="scope">
          <RouterLink
            :to="{ name: 'UserPage', params: { id: scope.item.id } }"
            class="text-decoration-none username-link"
          >
            {{ scope.item.username }}
          </RouterLink>
        </template>
      </BTable>
    </BCard>
    <BCard v-if="currentUser && !items.some(u => u.id === currentUser.id)"
       class="current-user-banner mt-3 p-2 text-center">
      #{{ currentUser.rank }} {{ currentUser.username }} — {{ currentUser.points }} points
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
.username-link {
  color: white;
}
.username-link:hover {
  color: hotpink;
  opacity: 0.8;
}
.my-table :deep(td),
.my-table :deep(th) {
  background-color: var(--section-bg);
  color: white;
}

.current-user-banner {
  background-color: #ffeb3b !important;
  color: black !important;
  font-weight: bold !important;
  font-size: 1.1rem;

}

</style>
