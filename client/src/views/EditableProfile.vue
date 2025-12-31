<script setup>
import {ref, computed, watch, reactive, onMounted} from 'vue'
import _ from 'lodash'
import { Api } from '@/Api.js'
import { useUserStore } from '@/stores/user.js'
import { BButton, BModal, useModal, useToast } from 'bootstrap-vue-next'

const { hide } = useModal()
const { create } = useToast()

const user = useUserStore()
watch(
  () => user.user?.id,
  (id) => {
    id && getUser(id)
  }
)
// true when data is being fetched from the server
const isLoading = ref(true)
const failMessage = ref(null)
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
        failMessage.value = response.data.message
        return
      }
      // raw data
      userData.value = response.data
    })
    .catch(error => {
      console.error('Failed to update user:', error)
      // failMessage.value = error
    })
    .finally(() => {
      isLoading.value = false
    })
}
const alertMessage = ref(null)
const isVisible = ref(false)

function patchUser() {
  if (!form.value.username) {
    alertMessage.value = 'Username is required'
    isVisible.value = true
    return
  }
  if (!form.value.email) {
    alertMessage.value = 'Email is required'
    isVisible.value = true
    return
  }
  if (!form.value.email.includes('@')) {
    alertMessage.value = 'Email needs an @-sign'
    isVisible.value = true
    return
  }
  Api.patch(`/users/${user.user.id}`, form.value)
    .then(response => {
      if (response.status !== 200) {
        // something went wrong
        alertMessage.value = response.data.message
        isVisible.value = true
        return
      }
      // update userData ref
      userData.value = response.data
    })
    .catch(error => {
      console.error('Failed to update user:', error)
      // for user
      alertMessage.value = error.response.data.message
      isVisible.value = true
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
        failMessage.value = response.data.message
        return
      }
      userData.value = { ...userData.value, url: response.data.url }
      successMessage.value = 'Image uploaded successfully!'
      // selectedAvatar.value = null
      // selectedFile.value = null
      // hide modal
      hide('directive-modal')
    })
    .catch(error => {
      console.error('Failed to upload profile picture:', error)
      // for user
      failMessage.value = 'Failed to upload image. Please try again.'
    })
}
// function triggered to show the toast
const showMe = (message, color) => {
  create({
    body: message,
    modelValue: 4000,
    variant: color,
    pos: 'top-center',
    progressProps: {
      variant: color
    }
  })
}
// watch success message
watch(successMessage, (newValue) => {
  // Only trigger if the message isn't empty
  if (newValue) {
    showMe(newValue, 'success')
    // clear the message after showing
    // so that the same message can trigger the toast again later
    successMessage.value = ''
  }
})
// watch failure message
watch(failMessage, (newValue) => {
  // Only trigger if the message isn't empty
  if (newValue) {
    showMe(newValue, 'warning')
    // clear the message after showing
    // so that the same message can trigger the toast again later
    failMessage.value = ''
  }
})

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
              :src="avatarSrc + '?' + new Date().getTime()"
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
          <form @submit.prevent="patchUser" @input="isVisible &&= false">
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
            <BAlert v-model="isVisible" class="sign-up-alert" variant="warning">{{  alertMessage }}</BAlert>
            <div class="buttons">
              <button type="submit" :disabled="isDisabled">Save</button>
              <button :disabled="isDisabled" @click.prevent="resetForm">Reset</button>
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
