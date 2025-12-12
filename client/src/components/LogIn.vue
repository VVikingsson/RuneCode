<template>
    <BForm @submit.prevent="logIn()" @input="showAlert = false">
        Username / E-mail
        <BFormInput v-model="identifier" class="sign-in-field">
        </BFormInput>
        Password
        <BFormInput v-model="password" type="password" class="sign-in-field">
        </BFormInput>
        <BAlert v-model:model-value="showAlert" variant="warning" class="sign-up-alert">{{ alertMessage }}</BAlert>
        <BButton class="sign-in-button" type=submit>Log in</BButton>
    </BForm>
    
</template>

<script setup>
    import { Api } from '@/Api'
    import { useRouter } from 'vue-router'; 
    import {useUserStore} from '@/stores/user';
    import { ref } from 'vue';

    const router = useRouter();
    let identifier = ref('');
    let password = ref('');
    let alertMessage = ref('');
    let showAlert = ref(false);
    const user = useUserStore();


    async function logIn() {
        try {
            if (identifier.value == '' || password.value == '') {
                alertMessage.value = 'Fill in both fields.';
                showAlert.value = true;
                return;
            }

            const response = await Api.post('/users/sessions', {identifier: identifier.value, password: password.value}, {withCredentials: true});
            console.log(response.status);
            if (response.status === 200) {
                user.setUser(response.data.user); // Set user in global store
                router.push({name: 'home'});
                return;
            }
            
            alertMessage.value = 'Something went wrong';
            showAlert.value = true;

        } catch (err) {
            if (err.status === 404) {
                let temp = identifier.value;
                password.value = '';
                identifier.value = '';
                alertMessage.value = `Identifier not found in database: ${temp}.`;
                showAlert.value = true;
            } else if (err.status === 401) {
                password.value = '';
                alertMessage.value = `Password is incorrect.`;
                showAlert.value = true;
            }
        }
    }
</script>

<style scoped>
    @import '../assets/signIn.css';
    .sign-up-alert {
        margin-bottom: -1rem !important;
    }
</style>