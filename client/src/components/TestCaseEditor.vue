<template>
  <BCard class="tc-card" v-for="tc in testCases" :key="tc._id">
    <BRow>
        <BCol cols="8">
            <BFormGroup>
                <label for="input">Input</label>
                <BFormInput class="tc-form tc-input mb-2" v-model="tc.input" :key="input">Input</BFormInput>
                <label for="output">Expected Output</label>
                <BFormInput class="tc-form tc-output mb-2" v-model="tc.expectedOutput" :key="output">Output</BFormInput>
            </BFormGroup>
        </BCol>
        <BCol cols="4" class="d-flex align-items-center justify-content-end">
            <BButton class="tc-edit-button tc-save-button d-flex align-items-center justify-content-center me-3" variant="outline-light">
                Save
            </BButton>
            <BButton class="tc-edit-button tc-icon-button tc-del-button d-flex align-items-center justify-content-center" variant="outline-light">
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
    label {
        color: var(--text-muted);
    }
    .tc-form {
        border: 2px solid var(--text-muted) !important;
        background-color: var(--dark-bg);
        font-family: 'JetBrains Mono', monospace;
        color: var(--primary-blue);
    }

    .tc-form:focus {
        border-color: var(--text-light) !important;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--neon-cyan) 35%, transparent);
        color: var(--neon-cyan);
        background-color: unset;
    }

    .tc-card {
        border: unset;
        background-color: var(--dark-bg);
    }

    .tc-edit-button {
        border: 2px solid var(--text-muted) !important;
        border-radius: 8px;
        color: var(--text-muted);
        font-family: 'JetBrains Mono', monospace;
    }

    ::v-deep.tc-icon-button {
        border-radius: 8px;
        width: 40px;
        height: 40px;
    }

    .tc-edit-button:hover {
        border-color: var(--text-light) !important;
        background-color: var(--dark-bg);
    }

    .tc-edit-icon {
        width: 20px;
        /* white filter: brightness(0) saturate(100%) invert(100%) sepia(2%) saturate(1322%) hue-rotate(280deg) brightness(115%) contrast(90%); */
        filter: brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(1222%) hue-rotate(139deg) brightness(89%) contrast(81%);
    }

    .tc-edit-button:hover img {
        filter: brightness(0) saturate(100%) invert(72%) sepia(13%) saturate(4560%) hue-rotate(338deg) brightness(103%) contrast(91%);
        }

    .tc-save-button:hover {
        color: var(--neon-cyan);
    }
</style>