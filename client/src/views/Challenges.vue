<template>
    <BContainer class="main-container">
        <BRow class="top-row">
        <BCol class="left-col">
            <h1 id="welcome-message">Start a battle of your choosing. Beware of the difficulty ahead!</h1>
        </BCol>
        <BCol>
        </BCol>
        </BRow>
    </BContainer>
</template>

<script>
export default {
    name: 'challenges'
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
    .top-row {
        padding-top: 5rem;
    }
    .left-col {
        margin-left: 5rem;
    }
    #welcome-message {
        text-align: left;
        font-size: 3.5rem;
    }
</style>
