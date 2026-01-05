<template>
    <BContainer fluid class="banner">
        <h2 id="title"><span id="chall-number">{{ number }}</span> <span id="chall-name">{{ name }}</span></h2>
    </BContainer>
</template>

<script setup>
    import { defineProps, ref, onMounted } from 'vue';

    const props = defineProps({
        name: {type: String, default: null},
        number: {type: String, default: null}
    });

</script>

<style scoped>
    .banner {
        border: 1px solid var(--card-bg);
        font-family: 'Kedebideri';
    }

    #title {
    }
    #chall-number {
        color: var(--primary-blue);
    }
    #chall-name {
        margin-left: 2rem;
    }
</style>