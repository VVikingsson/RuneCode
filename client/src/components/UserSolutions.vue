<script setup>

import { BContainer, BTab, BTabs } from 'bootstrap-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { Api } from '@/Api.js'

const router = useRouter();

const props = defineProps({
  id: { type: String, required: true }
})

const submissionsFields = [
  { key: 'submissionTitle', label: 'Your Solution' },
  { key: 'challengeName', label: 'Challenge' }
]
const userSubmissions = ref(null) // :items in table element
const isSubmissionsLoading = ref(false)
const submissionsError = ref(null)

function getSubmissions() {
  isSubmissionsLoading.value = true
  submissionsError.value = null
  Api.get(`/users/${props.id}/submissions`)
    .then(response => {
      userSubmissions.value = response.data
    })
    .catch(error => {
      submissionsError.value = error
      console.error('Failed to fetch submissions:', error)
    })
    .finally(() => {
      isSubmissionsLoading.value = false
    })
}

function goToSubmission(item) {
  try {
    router.push(`/submissions/${item.submissionId}`);
  } catch (err) {
    console.log('Error when navigating to submission');
  }
}

onMounted(() => { getSubmissions() })
</script>

<template>
  <div v-if="isSubmissionsLoading" class="text-center text-white">
    <BSpinner variant="info" /> Fetching submissions...
  </div>

  <BAlert v-else-if="submissionsError" show variant="danger" class="mt-3">
    Failed to load submissions.
  </BAlert>
  <BContainer v-else-if="userSubmissions" class="table-con p-4 rounded-4">
    <BTabs content-class="" class="my-tabs">
      <BTab
        title="Solutions"
        active
        class="first-tab"
      >
        <BTable
          v-if="userSubmissions.length > 0"
          hover
          :items="userSubmissions"
          :fields="submissionsFields"
          class="submissions-table text-start"
          @row-clicked="goToSubmission"
        >
        </BTable>
        <p v-else class="text-black-50">You have no submissions yet</p>
      </BTab>
    </BTabs>
  </BContainer>
</template>

<style scoped>
.table-con {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
}
.first-tab {
  background-color: var(--card-bg);
}

.my-tabs :deep(.nav-tabs) {
  background-color: transparent;
  border-bottom: none;
}
.submissions-table :deep(th) {
  background-color: transparent;
  color: white;
  border: none;
  padding: 15px;
}
.submissions-table {
  border-collapse: separate;
  border-spacing: 0 15px;
}
.submissions-table :deep(tbody tr td:first-child) {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  border-right: none;
}

.submissions-table :deep(tbody tr td:first-child):hover {
  cursor: pointer;
}

.submissions-table :deep(tbody tr td:last-child) {
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  border-left: none;
}
.submissions-table :deep(td){
  color: white;
  background-color: rgba(74, 120, 255, 0.5);
  padding: 15px;
  border: 1px solid var(--primary-blue);
}
</style>
