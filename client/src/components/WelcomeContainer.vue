<template>
    <BContainer class="main-container">
        <BRow class="top-row">
        <BCol class="left-col">
            <h1 id="welcome-message">Master the Ancient Art of <span id="last-word"><br/>Code</span></h1>
            <BButton class="begin-button" @click="goToRecommendedChallenge()">Begin your Journey →</BButton>
        </BCol>
        <BCol></BCol>
        </BRow>
    </BContainer>
</template>

<script setup>
import Runes from '../components/Runes.vue';
import MiniLeaderboard from '../components/MiniLeaderboard.vue';
import FeaturedChallenge from '../components/FeaturedChallenge.vue';
import { ref } from 'vue';
import { Api } from '@/Api'
import { useRouter } from 'vue-router';
const router = useRouter();

// 🛠️ Define the method as a standard JavaScript function
async function goToRecommendedChallenge() {
    console.log("Pressed button");
    const userId = '692f00f6a7a3649d16624682';
    const response = await Api.get(`/users/${userId}/recommendedChallenge`);
    const challenge = response.data.recommendedChallenge;
    router.push({name: 'Challenge', params: { id: challenge._id }});
}

// Functions are automatically exposed to the template, no explicit return needed.
</script>

<script>

</script>
<style>
    .main-container * {
        font-family: 'Kedebideri'
    }
    .main-container {
        min-width: 100% !important;
        /* border: 2px, solid, var(--light-blue); */
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
        border-width: 5px;
    }
</style>