<template>
    <BTabs content-class="mt-3">
        <BTab title="Description" active>
            <BContainer class="challenge-description-container">
            <h3 id="the-challenge">The Challenge:</h3>
            <p>{{ description }}</p>
        </BContainer>
        </BTab>
        <BTab title="Submissions">
            <ChallengeSubmissions :challengeId="route.params.id" />
        </BTab>
    </BTabs>
    
</template>


<script setup>
    import { defineProps } from 'vue';
    import { useRoute } from 'vue-router';
    import ChallengeSubmissions from './ChallengeSubmissions.vue';

    const route = useRoute();

    const props = defineProps({
        description: {type: String, default: null},
    })
</script>

<style scoped>
    .challenge-description-container {
        text-align: left;
        font-family: 'Kedebideri';
        width: 100%;
    }
    #the-challenge {
    }
</style>