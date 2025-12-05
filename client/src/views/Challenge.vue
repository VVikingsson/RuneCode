<template>
    <BContainer class="main-container">
        <ChallengeBanner :number="challNumber" :name="challName" :tags="challTags" :difficulty="challDifficulty"/>
    </BContainer>
    <BContainer class="challenge-info-flex-container">
        <ChallengeInfo :description="challDescription" class="challenge-info"/>
        <CodingWindow class="coding-window" :pythonCodeTemplate="challPythonTemplate"/>
    </BContainer>    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '@/Api'
import ChallengeBanner from '../components/ChallengeBanner.vue';
import ChallengeInfo from '../components/ChallengeInfo.vue';
import CodingWindow from '../components/CodingWindow.vue';

const route = useRoute();
const challenge = ref(null);
const challNumber = ref(null);
const challName = ref(null);
const challDifficulty = ref(null);
const challTags = ref(null);
const challDescription = ref(null);
const challPythonTemplate = ref(null);
const challJavascriptTemplate = ref(null); // For future when we add javascript templates to the challenges

async function fetchChallengeData(id) {
    try {
        const response = await Api.get('/challenges/'+id);
        return response.data
    } catch (err) {
        console.log('Failed to fetch challenge:', err);
    }
}


onMounted(async () => {
    const data = await fetchChallengeData(route.params.id);
    if (data) {
        challenge.value = data.challenge;
        challNumber.value = challenge.value.name.slice(0, 3);
        challName.value = challenge.value.name.slice(4, challenge.value.name.length);
        challDifficulty.value = challenge.value.difficulty;
        challTags.value = challenge.value.tags;
        challDescription.value = challenge.value.description;
        challPythonTemplate.value = challenge.value.codeTemplate;
    }
})
</script>

<style scoped>
    .challenge-info-flex-container {
        display: flex !important;
        max-width: unset !important;
        padding: unset !important;
    }

    .challenge-info {
        flex:1;
    }
    
    .coding-window {
        flex:1.5;
    }
</style>