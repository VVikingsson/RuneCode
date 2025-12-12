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
    <BButton @click="signUp()"class="sign-in-button">Sign Up</BButton>
</template>

<script setup>
    import { Api } from '@/Api';
    import { useRouter } from 'vue-router'; 
    import { useUserStore } from '@/stores/user';
    import { ref } from 'vue';

    const router = useRouter();
    let signUpUsername = ref('');
    let signUpEmail = ref('');
    let signUpPassword = ref('');
    let signUpRepeatPassword = ref ('');

    const user = useUserStore();

    async function signUp() {
        try {
            if (identifier == '' || password == '') {
                alert('Enter correct info bruh');
                return;
            }

            const response = await Api.post('/users', {identifier: identifier, password: password}, {withCredentials: true});
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