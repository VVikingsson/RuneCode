<template>
    <BAlert v-model:model-value="showTestCaseAlert" class="testCasesAlert" v-bind:variant="testCasesAlertVariant">
        {{ testCasesAlertMessage }}
    </BAlert>
  <BCard class="tc-card">
    <BRow>
        <BCol cols="8">
            <h5 class="ms-3 tc-header">Python Test Cases</h5>
        </BCol>
        <BCol cols="4" class="d-flex align-items-center justify-content-end">
            <BButton class="tc-edit-button tc-add-button tc-icon-button d-flex 
            align-items-center justify-content-center me-3" variant="outline-light"
            @click="emit('create', 'python')">
                <img src="@/assets/icons/plus.png" class="tc-edit-icon"/>
            </BButton>
        </BCol>
    </BRow>
    <BCard class="tc-card" v-for="tc in pythonTestCases" :key="tc._id">
        <BRow>
            <BCol cols="8">
                <BFormGroup>
                    <label for="input">Input</label>
                    <BFormInput class="tc-form tc-input mb-2" v-model="tc.input">Input</BFormInput>
                    <label for="output">Expected Output</label>
                    <BFormInput class="tc-form tc-output mb-2" v-model="tc.expectedOutput">Output</BFormInput>
                </BFormGroup>
            </BCol>
            <BCol cols="4" class="d-flex align-items-center justify-content-end">
                <BButton class="tc-edit-button tc-save-button d-flex align-items-center justify-content-center me-3"
                variant="outline-light" @click="saveTestCase(tc)">
                    Save
                </BButton>
                <BButton class="tc-edit-button tc-icon-button tc-del-button d-flex align-items-center justify-content-center" variant="outline-light" @click="emit('delete', tc._id);">
                    <img src="@/assets/icons/minus.png" class="tc-edit-icon"/>
                </BButton>
            </BCol>
        </BRow>
    </Bcard>
    <BRow>
        <BCol cols="8">
            <h5 class="ms-3 tc-header">Javascript Test Cases</h5>
        </BCol>
        <BCol cols="4" class="d-flex align-items-center justify-content-end">
            <BButton class="tc-edit-button tc-add-button tc-icon-button d-flex 
            align-items-center justify-content-center me-3" variant="outline-light"
            @click="emit('create', 'javascript')">
                <img src="@/assets/icons/plus.png" class="tc-edit-icon"/>
            </BButton>
        </BCol>
    </BRow>
    <BCard class="tc-card" v-for="tc in javascriptTestCases" :key="tc._id">
        <BRow>
            <BCol cols="8">
                <BFormGroup>
                    <label for="input">Input</label>
                    <BFormInput class="tc-form tc-input mb-2" v-model="tc.input">Input</BFormInput>
                    <label for="output">Expected Output</label>
                    <BFormInput class="tc-form tc-output mb-2" v-model="tc.expectedOutput">Output</BFormInput>
                </BFormGroup>
            </BCol>
            <BCol cols="4" class="d-flex align-items-center justify-content-end">
                <BButton class="tc-edit-button tc-save-button d-flex align-items-center justify-content-center me-3"
                variant="outline-light" @click="saveTestCase(tc)">
                    Save
                </BButton>
                <BButton class="tc-edit-button tc-icon-button tc-del-button d-flex align-items-center justify-content-center" variant="outline-light" @click="emit('delete', tc._id);">
                    <img src="@/assets/icons/minus.png" class="tc-edit-icon"/>
                </BButton>
            </BCol>
        </BRow>
    </Bcard>
  </BCard>
</template>


<script setup>
import { defineProps, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Api } from '@/Api';

const route = useRoute();

const emit = defineEmits(['delete', 'create', 'saveAll']);

const testCasesAlertMessage = ref('');
const showTestCaseAlert = ref(false);
const testCasesAlertVariant = ref('');
const dismissCountDown = ref(0);

const props = defineProps(
    {
        testCases: {type: Array, default: null}
    }
)

const pythonTestCases = computed(() =>
    props.testCases.filter(tc => tc.language.toLowerCase() === 'python')
);

const javascriptTestCases = computed(() =>
    props.testCases.filter(tc => tc.language.toLowerCase() === 'javascript')
);

function countDownChanged(value) {
    dismissCountDown.value = value;
}

function showAlert(message, variant = 'success') {
    testCasesAlertMessage.value = message;
    testCasesAlertVariant.value = variant;
    showTestCaseAlert.value = true;
    setTimeout(() => {
        showTestCaseAlert.value = false;
    }, 2000);
}

async function saveTestCase(tc) {
    try {
        console.log('Saving test case:', tc);
        let response;
        if (!tc._id) {
            response = await Api.post(`/challenges/${route.params.id}/test-cases`,
            {
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                language: tc.language
            });
        } else {
            response = await Api.put(`/challenges/${route.params.id}/test-cases/${tc._id}`,
            {
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                language: tc.language
            });
            }
        tc._id = response.data.testCase; // Prevent that the same frontend tc can POST multiple resources
        if (response.status == 200 || response.status == 201) {
            showAlert('Saved!');
        } else {
            showAlert('Error.', 'danger');
        }
    } catch (err) {
        console.log(`Error when saving test case:`, err);
        showAlert('Error.', 'danger');
    }
}
</script>


<style scoped>
    .testCasesAlert {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 6767;
    }
    .tc-header {
        color: var(--text-light);
    }
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

    .tc-del-button:hover img {
        filter: brightness(0) saturate(100%) invert(72%) sepia(13%) saturate(4560%) hue-rotate(338deg) brightness(103%) contrast(91%);
    }

    .tc-add-button:hover img {
        filter: brightness(0) saturate(100%) invert(84%) sepia(94%) saturate(7152%) hue-rotate(100deg) brightness(107%) contrast(106%);
    }

    .tc-save-button:hover {
        color: var(--neon-cyan);
    }
</style>