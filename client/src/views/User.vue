<script setup>
import { ref, onMounted, watch } from 'vue'
import { Api } from '@/Api'
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
  </BContainer>
</template>

<style scoped>

.user-profile-card {
  background-color: darkblue;
  color: white;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  border: none;
}

.divider {
  border-color: #444444;
}

.bio-text {
  line-height: 1.6;
}

</style>
