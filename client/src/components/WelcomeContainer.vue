<template>
    <RuneCode id="rune-code"/>
    <BContainer class="main-container">
        <BRow class="top-row">
            <BCol class="left-col">
                <h1 id="welcome-message">Master the Ancient Art of <span id="last-word"><br/>Code</span></h1>
                <BButton class="begin-button" @click="goToRecommendedChallenge()">Begin your Journey →</BButton>
            </BCol>
            <BCol>
                <Runes/>
            </BCol>
        </BRow>
    </BContainer>
</template>

<script setup>
import Runes from '../components/Runes.vue';
import RuneCode from '../components/RuneCode.vue'
import { ref } from 'vue';
import { Api } from '@/Api'
import { useRouter } from 'vue-router';

const router = useRouter();

async function goToRecommendedChallenge() {
    try {
        const response = await Api.get(`/challenges/recommendedChallenges`, {withCredentials: true});
        const challenge = response.data.recommendedChallenge;
        router.push({name: 'Challenge', params: { id: challenge._id }});
    } catch (err) {
        alert('Error getting recommended challenge, are you logged in?');
    }
}
</script>


<style scoped>
    .main-container * {
        font-family: 'Kedebideri'
    }
    .main-container {
        min-width: 100% !important;
        /* border: 2px, solid, var(--light-blue); */
    }
    #rune-code {
        padding: 1rem 0;
        max-width: 100% !important;
        box-shadow: 0 10px 70px 0px rgba(0, 191, 255, 0.4); /* Faint blue glow */
    }
    .top-row {
        padding-top: 5rem;
    }
    .left-col {
        margin-left: 5rem;
    }
    #last-word {
        color: var(--primary-blue);
    }
    #welcome-message {
        text-align: left;
        font-size: 3.5rem;
    }
    .begin-button {
        height: 3rem !important;
        margin-top: 4rem;
        margin-left: -8rem;
        font-weight: 500 !important;
        background-color: var(--primary-blue) !important;
        border: unset;
    }
</style>