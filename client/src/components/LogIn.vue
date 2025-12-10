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

    const router = useRouter();
    let identifier = ('');
    let password = ('');

    async function logIn() {
        try {
            if (identifier == '' || password == '') {
                alert('Enter correct info bruh');
                return;
            }

            const response = await Api.post('/users/sessions', {identifier: identifier, password: password}, {withCredentials: true});
            if (response.status === 200) {
                router.push({name: 'home'});
            }

        } catch (err) {
            alert(err);
        }
    }
</script>

<style scoped>
    @import '../assets/signIn.css';
</style>