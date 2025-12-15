<template>
    <BContainer>
        <BTabs v-model:index="activeTabIndex" content-class="mt-3">
        <BTab title="Python" active>
            <BFormTextarea v-model="pythonCode" autofocus no-resize rows="20" class="code-input-window"/>
        </BTab>
        <BTab title="Javascript">
            <BFormTextarea v-model="javascriptCode" autofocus no-resize rows="20" class="code-input-window"/>
        </BTab>
        </BTabs>

        <div class = "mt-2">
            <BButton @click="runCode">Run</BButton>
            <BButton :disabled="!submittable" @click="submitCode">Submit</BButton>
            <span v-if="draftSaved" class="ms-2 success">Draft saved</span>
        </div>
    </BContainer>
</template>

<script setup>
import { Api } from '@/Api'
import { defineProps, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
    pythonCodeTemplate: {type: String, required: true},
    javascriptCodeTemplate: {type: String, required: true}
});

const pythonCode = ref(props.pythonCodeTemplate);
const javascriptCode = ref(props.javascriptCodeTemplate); 
const activeTabIndex = ref(0); 

const submittable = ref(false);
const draftSaved = ref(false);


watch(() => props.pythonCodeTemplate, (newTemplate) => {
    pythonCode.value = newTemplate;
});

watch(() => props.javascriptCodeTemplate, (newTemplate) => {
    javascriptCode.value = newTemplate;
});

async function runCode() {
    try {
        const userId = "69402a6cc3642f3d4435773c";
        const userCode = activeTabIndex.value === 0 ? pythonCode.value : javascriptCode.value;
        const language = activeTabIndex.value === 0 ? "python" : "javascript";

        const response = await Api.post(`/drafts`, {
            code: userCode,
            language: language,
            authorId: userId,
            id: route.params.id,
        });

        const { passed, message, newSubmission } = response.data;

        if (passed) {
            draftSaved.value = true;
            submittable.value = true;  
            alert("Passed. Draft saved. " + message);
        } else {
            draftSaved.value = false;
            submittable.value = false;
            alert("Failed. " + message );
        }
    } catch (err) {
        console.log('Error posting to drafts:', err);
    }
}

async function submitCode() {
    if (!submittable.value) return;

    const title = prompt("Enter submission title:");
    if (!title || title.trim() === "") {
        alert("Submission title is required.");
        return;
    }

    const authorNote = prompt("Optional note:");
    const userId = "69402a6cc3642f3d4435773c";

    try {
        const response = await Api.post(`/submissions`, {
            title,
            authorNote,
            challengeId: route.params.id,
            authorId: userId
        });

        // ✅ use response to confirm submission
        alert("Submission created successfully! ID: " + response.data._id);

        submittable.value = false;
        draftSaved.value = false;
    } catch (err) {
        console.log("Error submitting code:", err);
        alert("Failed to submit code.");
    }
}
</script>


<style>
    .code-input-window {
        padding: 1rem 1rem;
        background-color:  var(--dark-bg) !important;
        color: var(--text-light) !important;
        font-family: 'JetBrains Mono', monospace;
    }
</style>