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
    import {useUserStore} from '@/stores/user';
    import { ref } from 'vue';

    const router = useRouter();
    let identifier = ref('');
    let password = ref('');
    const user = useUserStore();

    async function logIn() {
        try {
            if (identifier == '' || password == '') {
                alert('Enter correct info bruh');
                return;
            }

            const response = await Api.post('/users/sessions', {identifier: identifier, password: password}, {withCredentials: true});
            if (response.status === 200) {
                user.setUser(response.data.user); // Set user in global store
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