<template>
    <BContainer class="page-wrapper">
        <RuneCode id="runecode"/>

        <BContainer class="sign-in-container">
            <LogIn v-if="signingUp==false"/>
            <SignUp v-if="signingUp==true"/>
            <br/>
            <BButton @click="changeView()" class="change-sign-in-type-button">
                {{ changeSignInTypeButton }}
            </BButton>
        </BContainer>
    </BContainer>
</template>

<script setup>
import RuneCode from '../components/RuneCode.vue';
import LogIn from '../components/LogIn.vue';
import SignUp from '../components/SignUp.vue';
import { ref } from 'vue';

let signingUp = ref(false);
let changeSignInTypeButton = ref('I don\'t have an account');


function changeView() {
    signingUp.value = !signingUp.value;
    if (signingUp.value) {
        changeSignInTypeButton.value = 'I have an account';
    } else {
        changeSignInTypeButton.value = 'I don\'t have an account';
    }
}

</script>


<style scoped>
    .page-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    #runecode {
        margin-top: 2rem;
    }
    
    .sign-in-container {
        max-width: 30rem !important;
        background-color:  var(--dark-bg) !important;
        color: var(--text-light) !important;
        font-family: 'JetBrains Mono', monospace;
        border: 2px solid white;
        border-radius: 16px;
        padding: 2rem;

        margin-top: auto; /* auto sets it in the center of the available space. */
        margin-bottom: auto; /* without the page-wrapper, there is no free space. This is why we need page wrapper. */
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .change-sign-in-type-button {
        margin-top: 0rem;
        background-color: var(--dark-bg) !important;
    }

    .change-sign-in-type-button:hover {
        background-color: var(--card-bg) !important;
    }
</style>