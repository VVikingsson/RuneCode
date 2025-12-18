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
                            <small
                                class="difficulty-label"
                                :class="difficultyLevel(challenge.difficulty).class"
                            >
                                {{ difficultyLevel(challenge.difficulty).label }}
                            </small>

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

function difficultyLevel(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'easy':
            return { label: 'Skirmish', class: 'difficulty-skirmish' };
        case 'medium':
            return { label: 'Pillage', class: 'difficulty-pillage' };
        case 'hard':
            return { label: 'Raid', class: 'difficulty-raid' };
        default:
            return { label: difficulty, class: '' };
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
        min-width: 70% !important;
    }
    .top-row {
        padding-top: 2rem;
    }
    .left-col {
        margin-left: 2rem;
    }
    #welcome-message {
        color: var(--amber-accent) !important;
        text-align: center;
        font-size: 1.5rem;
    }


    .challenge-header {
        color: var(--primary-blue);
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .challenge-item-bg {
        cursor: pointer;
        background-color: var(--dark-bg) !important;
    }

    .challenge-description {
        color: var(--light-blue) !important;

    }
    .difficulty-label {
        font-weight: 600;
        letter-spacing: 0.03em;
    }

    /* Skirmish = easy */
    .difficulty-skirmish {
        color: var(--neon-cyan);
        text-shadow:
            0 0 2px var(--neon-cyan),
            0 0 4px var(--neon-cyan),
            0 0 6px var(--neon-cyan);
    }

    /* Pillage = medium */
    .difficulty-pillage {
        color: var(--neon-magenta);
        text-shadow:
            0 0 2px var(--neon-magenta),
            0 0 4px var(--neon-magenta),
            0 0 6px var(--neon-magenta);
    }

    /* Raid = hard */
    .difficulty-raid {
        color: var(--neon-orange);
        text-shadow:
            0 0 2px var(--neon-orange),
            0 0 4px var(--neon-orange),
            0 0 6px var(--neon-orange);
    }

</style>
