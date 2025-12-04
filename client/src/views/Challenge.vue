<template>
    <p>{{ challenge }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '@/Api'

const route = useRoute();
const challenge = ref(null);

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
    }
})
</script>