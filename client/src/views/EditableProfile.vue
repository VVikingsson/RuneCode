<script setup>

</script>

<template>
  <div class="main-container">
    <div class="edit-container">
      <h2 style="border: 1px solid blue">Profile</h2>
      <div class="upper-wrapper">
        <div class="profile-image">Profile image
          <div class="image-wrapper">
            <img
              src="https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0"
              alt="lebron james"
              class="image"
            />
          </div>
          <button>
            Upload picture
          </button>
        </div>
        <div class="profile-info">
          <div class="input-wrapper">
            <label style="border:1px solid blue">Username</label>
            <div class="input">Lebron James</div>
          </div>
          <div class="input-wrapper">
            <label>Email</label>
            <div class="input">myemail@gmail.com</div>
          </div>
        </div>
      </div>
      <div class="botton-wrapper">
        <div class="input-wrapper">
          <label style="border:1px solid blue">Bio</label>
          <div class="input">Change your bio</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  border: 1px solid red;
  width: 100%;
  /*align-items: center;*/
}
.edit-container {
  width: 70%;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
}
.upper-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.profile-image {
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 100px;
  height: 100px;
}
.profile-info {
  border: 1px solid white;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
}
.input-wrapper {
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.botton-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
