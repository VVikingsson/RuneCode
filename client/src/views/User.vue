<script setup>
import { ref, onMounted, watch } from 'vue'
import { Api } from '@/Api'
import { useRouter } from 'vue-router'
import { BContainer } from 'bootstrap-vue-next'
// defining props we got from routes
const props = defineProps({
  id: { type: String, required: true }
})
const userData = ref(null)
const isLoading = ref(true)
const error = ref(null)
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

const isEditing = ref(false)
const newBio = ref('')
const isSubmitting = ref(false)

function startEdit() {
  // Copy the current bio to the editable field
  newBio.value = userData.value.bio || ''
  // Switch to edit mode
  isEditing.value = true
}

function cancelEdit() {
  // Discard changes and switch back to display mode
  isEditing.value = false
}

function patchUser() {
  if (isSubmitting.value) return // Prevent double-clicks

  isSubmitting.value = true
  const reqBody = {
    bio: newBio.value
  }
  Api.patch(`/users/${props.id}`, reqBody)
    .then(response => {
      const updatedUser = response.data.user
      newBio.value = updatedUser.bio
      userData.value.bio = newBio.value
      isEditing.value = false
    })
    .catch(error => {
      console.error('Failed to update bio:', error)
      // for user
      alert('Failed to update bio. Please try again.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

const userSubmissions = ref(null)
const isSubmissionsLoading = ref(false)
const submissionsError = ref(null)

const submissionsFields = [
  { key: 'submissionTitle', label: 'Title' },
  { key: 'challengeName', label: 'Challenge' }
]

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
const router = useRouter()

function deleteUser() {
  if (!confirm(`Are you sure you want to permanently delete the profile for ${userData.value.username}? This action cannot be undone.`)) {
    return // Stop if the user cancels
  }
  Api.delete(`/users/${props.id}`)
    .then(response => {
      alert(`Profile for ${userData.value.username} has been successfully deleted.`)
      router.push('/')
    })
    .catch(error => {
      console.log(error)
      alert('Failed to delete profile. Please try again later.')
    })
}

onMounted(() => {
  getUser(props.id)
})
// watch props in case id changes
watch(
  () => props.id,
  (newId) => {
    getUser(newId)
  }
)
</script>

<template>
  <!--<div>
    {{ userData }}
  </div>-->
  <BContainer class="my-5">
    <div class="d-flex justify-content-center align-items-start position-relative">

      <BButton
        v-if="userData && props.id === '6932c310f4b96df1e658d9c1'"
        variant="danger"
        class="delete-btn-position"
        @click="deleteUser"
      >
        Delete User
      </BButton>

      <BCard class="user-profile-card">

      <div v-if="isLoading" class="text-center text-white">
        <BSpinner label="Loading..." variant="primary" />
        <p class="mt-2">Loading user's profile </p>
      </div>

      <BAlert v-else-if="error" show variant="danger">
        Error loading user data. Please try again.
      </BAlert>

      <div v-else-if="userData" class="profile-content">

        <BMedia class="align-items-center mb-4">
          <div>
            <h1 class="text-white mb-0">{{ userData.username }}</h1>
            <p class="h4 text-warning">
              <span class="me-2">Points:</span>
              <span class="fw-bold">{{ userData.points.toLocaleString('en-US') }}</span>
            </p>
          </div>
        </BMedia>

        <hr class="divider">

        <div class="bio-section">
          <h3 class="text-primary mb-2">Bio</h3>
          <div v-if="isEditing">
            <BForm @submit.prevent="patchUser">
              <BFormTextarea
                v-model="newBio"
                rows="5"
                max-rows="10"
                placeholder="Write your bio here..."
                class="mb-3"
              ></BFormTextarea>

              <div class="d-flex justify-content-end">
                <BButton
                  variant="secondary"
                  @click="cancelEdit"
                  class="me-2"
                  :disabled="isSubmitting"
                >
                  Cancel
                </BButton>
                <BButton
                  type="submit"
                  variant="primary"
                  :disabled="isSubmitting || newBio === userData.bio"
                >
                  <BSpinner v-if="isSubmitting" small></BSpinner>
                  <span v-else>Save Changes</span>
                </BButton>
              </div>
            </BForm>
          </div>
          <div v-else>
            <p class="text-light bio-text">
              {{ userData.bio || 'You have no bio yet.' }}
            </p>
            <BButton
              v-if="props.id === '6932c310f4b96df1e658d9c1'"
              variant="outline-secondary"
              size="sm"
              @click="startEdit"
            >
              Edit bio
            </BButton>
            </div>
        </div>

      </div>

      <BAlert v-else show variant="warning">
        User profile not found.
      </BAlert>

    </BCard>
    </div>

    <br>
    <!-- submissions table -->
    <div class="mt-4">
      <BButton
        v-if="userData && !userSubmissions"
        variant="info"
        :disabled="isSubmissionsLoading"
        @click="getSubmissions(props.id)"
      >
        <BSpinner v-if="isSubmissionsLoading" small></BSpinner>
        <span v-else>Show All Submissions</span>
      </BButton>

      <div v-else-if="isSubmissionsLoading" class="text-center text-white">
        <BSpinner variant="info" /> Fetching submissions...
      </div>

      <BAlert v-else-if="submissionsError" show variant="danger" class="mt-3">
        Failed to load submissions.
      </BAlert>

      <BCard v-else-if="userSubmissions" bg-variant="primary">
        <h4 class="text-black mb-3">Submissions ({{ userSubmissions.length }})</h4>

        <BTable
          v-if="userSubmissions.length > 0"
          hover
          dark
          :items="userSubmissions"
          :fields="submissionsFields"
          class="submissions-table text-start"
        >
        </BTable>
        <p v-else class="text-black-50">This user has no recorded submissions yet.</p>
      </BCard>
    </div>
  </BContainer>
</template>

<style scoped>

.user-profile-card {
  background-color: darkblue;
  color: white;
  padding: 2rem;
  border: none;
  width: 100%;
}

.divider {
  border-color: #444444;
}

.bio-text {
  line-height: 1.6;
}

.delete-btn-position {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -160px; /* Adjust this value to set the distance from the card */
  margin-top: 20px;
}
</style>
