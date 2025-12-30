<template>
  <BCard class="tc-card" v-for="tc in testCases" :key="tc._id">
    <BRow>
        <BCol cols="8">
            <BFormGroup>
                <BFormInput class="tc-form mb-2" v-model="tc.input">Input</BFormInput>
                <BFormInput class="tc-form mb-2" v-model="tc.expectedOutput">Output</BFormInput>
            </BFormGroup>
        </BCol>
        <BCol cols="4" class="d-flex align-items-center justify-content-end">
            <BButton class="tc-edit-button tc-del-button d-flex align-items-center justify-content-center" variant="outline-light">
                <img src="@/assets/icons/minus.png" class="tc-edit-icon"/>
            </BButton>
        </BCol>
    </BRow>
  </Bcard>
</template>


<script setup>
import { defineProps } from 'vue';

const props = defineProps(
    {
        testCases: Array
    }
)

</script>


<style scoped>
    .tc-card {
        border: unset;
        background-color: var(--dark-bg);
    }

    ::v-deep.tc-edit-button {
        border-radius: 8px;
        width: 40px;
        height: 40px;
        border: 3px solid var(--text-muted) !important;
    }

    .tc-edit-button:hover {
        border-color: var(--text-light) !important;
        background-color: var(--dark-bg);
    }

    .tc-edit-icon {
        width: 20px;
        filter: brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(206deg) brightness(88%) contrast(85%);
        filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%);
    }

    .tc-edit-button:hover img {
        filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%);
    }
</style>