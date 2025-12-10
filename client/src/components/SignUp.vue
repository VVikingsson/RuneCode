<template>
    Username
    <BFormInput v-model="signUpUsername" class="sign-in-field">
    </BFormInput>
    Email
    <BFormInput v-model="signUpEmail" class="sign-in-field">
    </BFormInput>
    Password
    <BFormInput v-model="signUpPassword" type="password" class="sign-in-field">
    </BFormInput>
    Repeat Password
    <BFormInput v-model="signUpRepeatPassword" type="password" class="sign-in-field">
    </BFormInput>
    <BButton class="sign-in-button">Sign Up</BButton>
</template>

<script setup>

</script>

<style scoped>
    @import '../assets/signIn.css';
</style>