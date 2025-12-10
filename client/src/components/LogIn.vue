<template>
    Username / E-mail
    <BFormInput v-model="identifier" class="sign-in-field">
    </BFormInput>
    Password
    <BFormInput v-model="password" type="password" class="sign-in-field">
    </BFormInput>
    <BButton class="sign-in-button" @click="logIn()">Log in</BButton>
</template>

<script setup>
    import { Api } from '@/Api'
    import { useRouter } from 'vue-router'; 

    function logIn() {
        try {
            if (identifier == '' || password == '') {
                alert('Enter correct info bruh');
                return;
            }

        } catch (err) {
            alert(err);
        }
    }
</script>

<style scoped>
    @import '../assets/signIn.css';
</style>