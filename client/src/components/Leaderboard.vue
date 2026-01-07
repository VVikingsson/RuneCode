<script setup>
import { Api } from '@/Api'
import { ref, onMounted } from 'vue'

const currentUser = ref(null);
// this is the attributes that will be displayed
const fields = [
  { key: 'rank', label: 'Rank' },
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
      items.value = users.map((user, index) => {
        return {
          // for rank display
          rank: index + 1,
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
  <div class="table-wrapper">
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
    <BCard v-if="currentUser && !items.some(u => u.id === currentUser.id)"
       class="current-user-banner mt-3 p-2 text-center">
      #{{ currentUser.rank }} {{ currentUser.username }} — {{ currentUser.points }} points
    </BCard>
  </div>
</template>

<style scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}
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
  color: var(--amber-primary);
}
.my-table :deep(td)
 {
  background-color: var(--section-bg);
  /*background-color: var(--primary-blue);*/
  color: white;
}
.my-table :deep(thead th:first-child) {
  border-top-left-radius: 12px;
}
.my-table :deep(thead th:last-child) {
  border-top-right-radius: 12px;
}
.my-table :deep(th) {
  background-color: var(--amber-accent);
  color: black;
}
.my-table {
  width: 85%;

}
.current-user-banner {
  background-color: #ffeb3b !important;
  color: black !important;
  font-weight: bold !important;
  font-size: 1.1rem;

}

</style>
