<template>
    <BForm @submit.prevent="signUp()" @input="showAlert=false">
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
        <BAlert v-model:model-value="showAlert" class="sign-up-alert" variant="warning">{{  alertMessage }}</BAlert>
        <BButton type=submit class="sign-in-button">Sign Up</BButton>
    </BForm>
</template>

<script setup>
    import { Api } from '@/Api';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/stores/user';
    import { ref } from 'vue';

    const router = useRouter();
    const user = useUserStore();

    let showAlert = ref(false);
    let alertMessage = ref('');
    let signUpUsername = ref('');
    let signUpEmail = ref('');
    let signUpPassword = ref('');
    let signUpRepeatPassword = ref ('');


    async function signUp() {
        try {
            if (!signUpUsername.value || !signUpEmail.value ||
                ! signUpPassword.value || !signUpRepeatPassword.value
            ) {
                alertMessage.value = 'Fill in all fields.';
                showAlert.value = true;
                return;
            } else if (!signUpEmail.value.includes('@')) {
                alertMessage.value = 'Emails need an @-sign.';
                showAlert.value = true;
                return;
            } else if (signUpPassword.value != signUpRepeatPassword.value) {
                alertMessage.value = 'Passwords do not match.';
                showAlert.value = true;
                signUpPassword.value = '';
                signUpRepeatPassword.value = '';
                return;
            }

            const response = await Api.post('/users', {
                username: signUpUsername.value,
                password: signUpPassword.value,
                email: signUpEmail.value
            }, {withCredentials: true});

            if (response.status === 201) {
              await user.restoreSession();
              await router.push({ name: 'home' });
              return;
            }

            alertMessage.value = 'Something went wrong';
            showAlert.value = true;

        } catch (err) {
            let message = err.response.data.message;
            alertMessage.value = message;
            if (message.includes('username')) {
                signUpUsername.value = '';
            } else if (message.includes('email')) {
                signUpEmail.value = '';
            }
            showAlert.value = true;
            console.log(err);
        }
    }
</script>

<style scoped>
    @import '../assets/signIn.css';
    .sign-up-alert {
        margin-bottom: -0.5rem !important;
    }
</style>
