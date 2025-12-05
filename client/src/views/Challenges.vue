<template>
    <BContainer class="main-container">
        <BRow class="top-row">
            <BCol class="left-col">
            <h1 id="welcome-message">Start a battle of your choosing. Beware of the difficulty ahead!</h1>
                <BListGroup class="mt-3">
                    <BListGroupItem
                        v-for="challenge in challenges"
                        :key="challenge._id"
                        @click="goToChallengePage(challenge._id)"
                        button
                        class="flex-column align-items-start challenge-item-bg"
                    >
                        <div class="challenge-header">
                            <h5 class="mb-1">{{ challenge.name }}</h5>
                            <small class="text-body-secondary">{{ challenge.difficulty }}</small>
                        </div>


                        <p v-if="challenge.description" class="challenge-description mb-1">
                            {{ challenge.description }}
                        </p>
                    </BListGroupItem>
                </BListGroup>
            </BCol>
        </BRow>
    </BContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Api } from '@/Api';
import { useRouter } from 'vue-router';
import { BContainer, BRow, BCol, BListGroup, BListGroupItem } from 'bootstrap-vue-next';

const challenges = ref([]);
const router = useRouter();

async function fetchChallenges() {
    try {
        const response = await Api.get('/challenges');
        challenges.value = response.data.data || response.data || [];
        console.log('Challenges loaded:', challenges.value); // debug
    } catch (err) {
        console.error('Failed to get challenges', err);
        challenges.value = [];
    }
}

function goToChallengePage(_id) {
    if (!_id) return;
    router.push({name: 'Challenge', params: { id: _id }}); 
}

onMounted(fetchChallenges)
</script>

<script>
export default {
    name: 'challenges'
}
</script>

<style scoped>
    .main-container * {
        font-family: 'Kedebideri';
    }
    .main-container {
        min-width: 100% !important;
    }
    .top-row {
        padding-top: 1rem;
    }
    .left-col {
        margin-left: 2rem;
    }
    #welcome-message {
        text-align: left;
        font-size: 1.75rem;
    }


    .challenge-header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .challenge-item-bg {
        cursor: pointer;
        background-color: var(--section-bg) !important;
    }

    .challenge-description {
        color: var(--light-blue) !important;

    }
    .text-body-secondary {
        color: var(--amber-accent) !important;
    }
</style>
