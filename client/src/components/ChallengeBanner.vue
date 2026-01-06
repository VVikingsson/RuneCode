<template>
    <BContainer fluid class="banner">
        <RouterLink :to="`/challenges/${id}`" class="banner-link">
            <h2 id="title"><span id="chall-number">{{ number }}</span> <span id="chall-name">{{ name }}</span></h2>
        </RouterLink>
    </BContainer>
</template>

<script setup>
    import { defineProps, ref, onMounted } from 'vue';

    const props = defineProps({
        name: {type: String, default: null},
        number: {type: String, default: null},
        id: {type: String, default: ""}
    });

</script>

<style scoped>
    .banner {
    border: 1px solid var(--card-bg);
    font-family: 'Kedebideri';
    }

    .banner-link {
        text-decoration: none;
        color: inherit;
    }

    .banner-link #chall-number {
        color: var(--primary-blue);
    }

    .banner-link #chall-name {
        margin-left: 2rem;
    }
</style>