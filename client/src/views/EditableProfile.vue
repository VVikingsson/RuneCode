<script setup>
import {ref, computed, watch, reactive, onMounted} from 'vue'
import _ from 'lodash'
import { Api } from '@/Api.js'
import { useUserStore } from '@/stores/user.js'
import { BButton, BModal, useModal } from 'bootstrap-vue-next'

const { hide } = useModal()

const user = useUserStore()
watch(
  () => user.user?.id,
  (id) => {
    id && getUser(id)
  }
)

// true when data is being fetched from the server
const isLoading = ref(true)
const alertMessage = ref(null)
const successMessage = ref(null)

const defaultAvatar = 'https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0'

const userData = ref(null)
watch(
  () => userData.value,
  (val) => {
    console.log(val)
  }
)

function getUser(userID) {
  isLoading.value = true
  Api.get('/users/' + userID)
    .then(response => {
      if (response.status !== 200) {
        // something went wrong
        alertMessage.value = response.data.message
        return
      }
      // raw data
      userData.value = response.data
    })
    .catch(error => {
      alertMessage.value = error
    })
    .finally(() => {
      isLoading.value = false
    })
}

function patchUser() {
  Api.patch(`/users/${user.user.id}`, form.value)
    .then(response => {
      if (response.status !== 200) {
        // something went wrong
        alertMessage.value = response.data.message
        return
      }
      // update userData ref
      userData.value = response.data
    })
    .catch(error => {
      console.error('Failed to update user:', error)
      // for user
      alertMessage.value = error.response.data.message
    })
    .finally(() => {
    })
}

function uploadAvatar() {
  const formData = new FormData()
  formData.append('profileImage', selectedFile.value)
  Api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(response => {
      if (response.status !== 200) {
        // something went wrong
        alertMessage.value = response.data.message
        return
      }
      userData.value = { ...userData.value, url: response.data.url }
      successMessage.value = 'File uploaded successfully!'
      // selectedAvatar.value = null
      // selectedFile.value = null
      // hide modal
      hide('directive-modal')
    })
    .catch(error => {
      console.error('Failed to upload profile picture:', error)
      // for user
      alertMessage.value = 'Failed to upload profile. Please try again.'
    })
}

const selectedAvatar = ref(null)
const selectedFile = ref(null)

function onAvatarSelected(event) {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0]
    selectedAvatar.value = URL.createObjectURL(selectedFile.value)
  }
}

const avatarSrc = computed(() => {
  return userData.value?.url || defaultAvatar
})

const selectedAvatarSrc = computed(() => {
  return selectedAvatar.value || avatarSrc.value
})
// cancel picture upload
function onCancel() {
  selectedAvatar.value = null
  // alertMessage.value = null
  hide('directive-modal')
}

const originalForm = computed(() => {
  return userData.value && {
    username: userData.value.user.username,
    email: userData.value.user.email,
    bio: userData.value.user.bio
  }
})
const form = computed(() => userData.value && reactive({
  username: userData.value.user.username,
  email: userData.value.user.email,
  bio: userData.value.user.bio
}))

function resetForm() {
  form.value.username = userData.value.user.username
  form.value.email = userData.value.user.email
  form.value.bio = userData.value.user.bio
}

const showAlertToast = ref(false)
const showSuccessToast = ref(false)

// Watch the messages and show toasts automatically
watch(alertMessage, (val) => {
  if (val) {
    showAlertToast.value = true
  }
})

watch(successMessage, (val) => {
  if (val) {
    showSuccessToast.value = true
  }
})
// for keeping track of whether original data has being changed
const isDisabled = computed(() => {
  return _.isEqual(form.value, originalForm.value)
})
// get user with id stored in user store (the id of the owner)
// onMounted(() => {
//   getUser(user.user.id)
// })
</script>

<template>
  <div class="main-container">
    <BToast
      v-model="showSuccessToast"
      title="Success"
      variant="success"
      solid
      :delay="3000"
      auto-hide
      toaster="b-toaster-top-right"
      @hidden="successMessage = null"
    >
      {{ successMessage }}
    </BToast>

    <!-- Alert Toast -->
    <BToast
      v-model="showAlertToast"
      title="Error"
      variant="danger"
      solid
      auto-hide-delay="5000"
      toaster="b-toaster-top-right"
      @hidden="() => { showAlertToast = false; alertMessage = null }"
    >
      {{ alertMessage }}
    </BToast>
    <div v-if="isLoading" class="text-center text-white">
      <BSpinner label="Loading..." variant="primary"/>
      <p class="mt-2">Loading user's profile </p>
    </div>
    <div v-else-if="userData && form" class="edit-container">
      <h2>Profile</h2>
      <div class="upper-wrapper">
        <div class="profile-image">
          <div class="image-wrapper">
            <img
              :src="avatarSrc"
              alt="lebron james"
              class="image"
            />
          </div>
          <BButton v-b-modal.directive-modal>
            Edit picture
          </BButton>
          <BModal
            title="Edit picture"
            id="directive-modal"
            centered
            header-class="my-header"
            footer-class="my-footer"
            no-close-on-esc
            no-close-on-backdrop
          >
            <template #header>
              Modal Header
            </template>
            <template #default>
              <div class="avatar-submit">
                <form id="avatar-form" @submit.prevent="uploadAvatar" style="align-items: center" enctype="multipart/form-data">
                  <div class="image-wrapper">
                    <img
                      :src="selectedAvatarSrc"
                      alt="lebron james"
                      class="image"
                    />
                  </div>
                  <label for="avatar" class="avatar-label">Choose image</label>
                  <input
                    type="file"
                    id="avatar"
                    name="profileImage"
                    style="display: none"
                    accept="image/png, image/jpeg"
                    @change="onAvatarSelected"
                  />
                </form>
              </div>
            </template>
            <template #footer>
              <div class="footer-buttons">
                <button :disabled="!selectedAvatar" type="submit" form="avatar-form" class="btn-primary">Save</button>
                <button @click="onCancel" class="btn-info">Cancel</button>
              </div>
            </template>

          </BModal>
        </div>

        <div class="profile-info">
          <form @submit.prevent="patchUser">
            <div class="input-wrapper">
              <label>Username</label>
              <input v-model="form.username" type="text" class="input" placeholder="Choose username"/>
            </div>
            <div class="input-wrapper">
              <label>Email</label>
              <input v-model="form.email" type="text" class="input" placeholder="Your email"/>
            </div>
            <div class="input-wrapper">
              <label>Bio</label>
              <textarea v-model="form.bio" type="text" class="input" placeholder="Your bio"/>
            </div>
            <div class="buttons">
              <button type="submit" :disabled="isDisabled">Save</button>
              <button :disabled="isDisabled" @click.prevent="resetForm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <BAlert v-else show variant="warning">
      User profile not found.
    </BAlert>
  </div>

</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  /*align-items: center;*/
  padding: 40px 15% 20px 15%;
}

h2 {
  text-align: left;

}

.edit-container {
  border: 1px solid white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 30px 30px;
  gap: 16px;
}

.upper-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.profile-image {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  width: 200px;
}

.image-wrapper {
  border: 2px solid blue;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  object-fit: cover;
}

.image {
  object-fit: cover;
  width: 144px;
  height: 144px;
}

.profile-info {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.input {
  border: 2px solid var(--primary-blue);
  border-radius: 8px;
  background-color: var(--card-bg);
  padding: 10px 10px;
  color: white;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding-top: 16px;
}

.buttons > * {
  background-color: var(--amber-accent);
  padding: 10px;
  border-radius: 8px;
  border: 2px solid beige;
  color: white;
}

.buttons > *:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.avatar-submit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-label {
  background-color: var(--primary-blue);
  padding: 6px;
  border-radius: 8px;

}

.footer-buttons {
  display: flex;
  gap: 8px;
  align-items: end;
}
</style>
<style>
.my-header {
  color: black;
}
</style>
