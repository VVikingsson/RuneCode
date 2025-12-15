<template>
  <BContainer class="submissions-container">
    <h3 class="mb-3">Submissions</h3>

    <!-- Loading -->
    <p v-if="loading" class="text-body-secondary">Loading submissions...</p>

    <!-- Empty -->
    <p v-else-if="submissions.length === 0" class="text-body-secondary">
      No submissions yet.
    </p>

    <!-- Submissions list -->
    <BListGroup v-else>
      <BListGroupItem
        v-for="submission in submissions"
        :key="submission._id"
        class="flex-column align-items-start submission-item-bg"
      >
        <div class="submission-header">
          <h5 class="mb-1">
            {{ submission.title || 'Untitled Submission' }}
          </h5>
        </div>

        <p v-if="submission.authorNote" class="submission-note mb-1">
          {{ submission.authorNote }}
        </p>

        <p class="text-muted small">
          By: {{ submission.author?.username || 'Unknown User' }}
        </p>
      </BListGroupItem>
    </BListGroup>
  </BContainer>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { Api } from '@/Api'

const props = defineProps({
  challengeId: { type: String, required: true }
})

const submissions = ref([])
const loading = ref(true)

async function fetchSubmissions() {
  try {
    const response = await Api.get(
      `/challenges/${props.challengeId}/submissions`
    )
    submissions.value = response.data
  } catch (err) {
    console.error('Failed to load submissions:', err)
    submissions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSubmissions()
})
</script>

<style scoped>
.submissions-container {
  text-align: left;
  font-family: 'Kedebideri';
}

.submission-item-bg {
  background-color: var(--dark-bg);
  color: var(--text-light);
  border: 1px solid #333;
}

.submission-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.submission-note {
  font-style: italic;
  opacity: 0.85;
}
</style>
