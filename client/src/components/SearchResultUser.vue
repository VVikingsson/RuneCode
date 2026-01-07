<template>
    <BListGroupItem button class="search-result-user" @click="navigateToUserPage">
        <BRow>
            <BCol cols="2" class="text-start">
                <span class="username">{{ user.username }}</span>
            </BCol>
            <BCol cols="6"></BCol>
            <BCol cols="4"></BCol>
        </BRow>
        <BRow>
            <BCol cols="7" class="text-start">
                <span class="user-info-text">{{ user.bio || 'No bio' }}</span>
            </BCol>
            <BCol cols="5">
                <span class="user-info-text">
                    Challenges completed: {{ user.completed.easy + user.completed.medium + user.completed.hard }}
                     ({{ user.completed.easy }}|{{ user.completed.medium }}|{{ user.completed.hard }})
                </span>
            </BCol>
        </BRow>
    </BListGroupItem>
</template>


<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();

const props = defineProps({
  user: Object
});

function navigateToUserPage() {
    try {
        router.push({path: `users/${props.user._id}`})
    } catch(err) {
        alert('Failed to navigate to user page');
    }
}

</script>


<style scoped>
    .username {
        color: var(--text-light);
    }

    .search-result-user {
        background-color: var(--dark-bg) !important;
        color: var(--text-muted);
        border: unset;
        font-family: 'JetBrains Mono', monospace !important;
    }

    .search-result-user:hover {
        background-color: var(--dark-bg);
        color: var(--text-muted) !important;
    }

    .search-result-user:hover .username {
        color: var(--amber-primary);
    }
    
</style>