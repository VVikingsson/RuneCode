<template>
    <BContainer>
        <BTabs v-model:index="activeTabIndex" content-class="mt-3">
        <BTab title="Python" active>
            <BFormTextarea v-model="pythonCode" autofocus no-resize rows="20" class="code-input-window"/>
        </BTab>
        <BTab title="Javascript">
            <BFormTextarea v-model="javascriptCode" autofocus no-resize rows="20" class="code-input-window"/>
        </BTab>
        <BButton @click="runCode">
            Run
        </BButton>
        <BButton>
            Submit
        </BButton>
    </BTabs>
        
    </BContainer>
</template>

<script setup>
import { Api } from '@/Api'
import { defineProps, ref, watch, computed} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
    pythonCodeTemplate: {type: String, required: true}
});

const pythonCode = ref(props.pythonCodeTemplate);
const javascriptCode = ref('Replace with JS template prop when added'); 
const activeTabIndex = ref(0); 


watch(() => props.pythonCodeTemplate, (newTemplate) => {
    pythonCode.value = newTemplate;

});

async function runCode() {
    
    try {
        const userId = import.meta.env.VITE_TEMP_USER_ID;
        const userCode = activeTabIndex.value === 0 ? pythonCode.value : javascriptCode.value;
        const language = activeTabIndex.value === 0 ? "python" : "javascript";


        console.log(activeTabIndex.value);

        await Api.post('/drafts', {
            code: userCode, language: language, authorId: userId, id: route.params.id
        }).then( (response) => {
            if (response.data.passed) {
            alert('Passed! ' + response.data.message);
            } else {
                alert('Failed :( ' + response.data.message);
            }
        });
    } catch (err) {
        console.log('Error posting to drafts:', err);
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