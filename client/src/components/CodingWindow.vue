<template>
    <BModal v-model="showTestCaseModal" centered scrollable class="test-cases-modal" size="lg" 
    @ok="saveAllTestCases" @cancel="clearTestCaseEditorCache" @esc="clearTestCaseEditorCache"
    @close="clearTestCaseEditorCache" @backdrop="clearTestCaseEditorCache">
        <TestCaseEditor :testCases="testCases" @create="stageEmptyTestCase" @delete="flagTestCaseForDeletion"/>
    </BModal>
    <BContainer>
        <BRow>
            <BCol cols="12" md="10">
            <BTabs pills class="coding-tabs" v-model:index="activeTabIndex" content-class="mt-3">
                <BTab class="coding-tab" title="Python" active>
                    <div class="editor-wrapper">
                    <code-mirror
                        class="coding-window"
                        v-model="pythonCode"
                        basic
                        :lang="lang"
                        :tab="true"
                        :tab-size="4"
                        :allow-multiple-selections="true"
                        :extensions="extensions"
                    />
                    <BAlert v-model:model-value="showAlert" v-bind:variant="alertVariant" dismissible class="code-feedback-alert">
                        {{ alertMessage }}
                    </BAlert>
                    </div>
                </BTab>
                <BTab class="coding-tab" title="Javascript">
                    <div class="editor-wrapper">
                    <code-mirror
                        class="coding-window"
                        v-model="javascriptCode"
                        basic
                        :lang="lang"
                        :tab="true"
                        :tab-size=4
                        :allow-multiple-selections="true"
                        :extensions="extensions"
                    />
                    <BAlert v-model:model-value="showAlert" v-bind:variant="alertVariant" dismissible class="code-feedback-alert">
                        {{ alertMessage }}
                    </BAlert>
                    </div>
                </BTab>
                <template #tabs-end>
                    <BButton id="edit-tests-btn" @click="loadTestCases(); showTestCaseModal = !showTestCaseModal">Edit Tests</BButton>
                </template>
            </BTabs>
            </BCol>
            <BCol cols="12" md="2"">
                <div class="all-buttons d-flex flex-row flex-md-column gap-2">
                    <BButton @click="runCode" class="run-button">Run</BButton>
                    <BButton class="submit-button" :disabled="!submittable" @click="submitCode">Submit</BButton>
                    <BButton @click="resetWorkspaceToDefault">Reset Workspace</BButton>
                </div>
            </BCol>
        </BRow>
    </BContainer>
</template>

<script setup>
import { Api } from '@/Api'
import { defineProps, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CodeMirror from 'vue-codemirror6'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { tags } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { useUserStore } from '../stores/user.js';
import TestCaseEditor from './TestCaseEditor.vue';

const route = useRoute();
const user = useUserStore();

const props = defineProps({
    pythonCodeTemplate: {type: String, default: null},
    javascriptCodeTemplate: {type: String, default: null},
    links: {type: Object, default: null}
});

// ************************** REACTIVE VARIABLES
const pythonCode = ref(props.pythonCodeTemplate);
const javascriptCode = ref(props.javascriptCodeTemplate); 
const activeTabIndex = ref(0); 
const lang = ref(python());
const showTestCaseModal = ref(false);
const testCases = ref([]);
const alertVariant = ref('');
const showAlert = ref(false);
const alertMessage = ref('');
const submittable = ref(false);

let draftSaved = false;
let flaggedTestCases = [];
let newTestCaseCounter = 1;


// *************************** OBSERVERS
let pythonTemplate = "";
let javascriptTemplate = "";
watch(() => props.pythonCodeTemplate, (newTemplate) => {
    pythonTemplate = newTemplate;
    if (!pythonCode.value) {
        pythonCode.value = newTemplate;
    }
});
watch(() => props.javascriptCodeTemplate, (newTemplate) => {
    javascriptTemplate = newTemplate;
    if (!javascriptCode.value) {
        javascriptCode.value = newTemplate;
    }
});
watch(() => activeTabIndex.value, (index) => {
    lang.value = [python(), javascript()][index];
});
// Save workspace 2 seconds after changing it. If a new change happens before 2 seconds, timer is reset.
let timer;
watch(() => [pythonCode.value, javascriptCode.value], () => {
    clearTimeout(timer);
    timer = setTimeout(saveWorkspace, 2000);
});

// ************************** FUNCTIONS
async function runCode() {
    try {
        const userCode = activeTabIndex.value === 0 ? pythonCode.value : javascriptCode.value;
        const language = activeTabIndex.value === 0 ? "python" : "javascript";


        const response = await Api.post(props.links.run.href, {
            code: userCode, language: language, id: route.params.id
        })
        const { passed, message, newSubmission } = response.data;

        if (passed) {
            draftSaved = true;
            submittable.value = true;  
            alertMessage.value = message;
            alertVariant.value = 'success';
            showAlert.value = true;
        } else {
            draftSaved = false;
            submittable.value = false;
            alertMessage.value = response.data.message;
            alertVariant.value = 'danger';
            showAlert.value = true;
        }
    } catch (err) {
        alertMessage.value = 'Unexpected error';
        console.log('Error running code:', err)
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

    try {

        const response = await Api.post(props.links.submit.href, {
            title,
            authorNote,
            challengeId: route.params.id,
        });

        alert("Submission created successfully! ID: " + response.data._id);

        submittable.value = false;
        draftSaved = false;
    } catch (err) {
        console.log("Error submitting code:", err);
        alert("Failed to submit code.");
    }
}

async function loadWorkspace() {
    try {
        const response = await Api.get(`workspaces?challId=${route.params.id}`);
        if (response.data) {
            pythonCode.value = response.data.pythonCode;
            javascriptCode.value = response.data.javascriptCode;
        }
    } catch (err) {
        console.log('Error:', err);
    }
}

async function saveWorkspace() {
    try {
        const response = await Api.put(`workspaces?challId=${route.params.id}`, {
            pythonCode: pythonCode.value, javascriptCode: javascriptCode.value
        });
    } catch (err) {
        console.log(`Failed saving workspace: ${err}`);
    }
}

async function resetWorkspaceToDefault() {
    try {
        const response = await Api.put(`workspaces?challId=${route.params.id}`, {
        pythonCode: pythonTemplate, javascriptCode: javascriptTemplate
        });
        pythonCode.value = pythonTemplate;
        javascriptCode.value = javascriptTemplate;
    } catch (err) {
        console.log(`Failed to reset workspace to default: ${err}`);
    }
}

async function loadTestCases() {
    try {
        const response = await Api.get(`challenges/${route.params.id}/test-cases`);
        console.log(response.data.testCases);
        testCases.value = response.data.testCases;
        
    } catch (err) {
        console.log(`Failed to load test cases: ${err}`);
    }
}

function flagTestCaseForDeletion(id) {
    try {
        testCases.value = testCases.value.filter(tc => tc._id != id);
        flaggedTestCases.push(id);
    } catch (err) {
        console.log('Unexpected error when flagging test case for deletion:', err);
    }
}

async function saveAllTestCases() {
    try {
        console.log('Deleting flagged');
        console.log(flaggedTestCases);
        if (testCases.value.length == 0) {
            // Delete all tests 
            const response = await Api.delete(`/challenges/${route.params.id}/test-cases`);
        } else {
            for (const id of flaggedTestCases) {
                console.log('why');
                const response = await Api.delete(`/testCases/${id}`);
                testCases.value = testCases.value.filter(tc => (tc._id != id));
            }
        }
        for (const tc of testCases.value) {
            if (!tc._id) {
                const response = await Api.post(`challenges/${route.params.id}/test-cases`, {
                    language: tc.language,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput
                });
            console.log('BECAME POST', response.data);
            } else {
                const response = await Api.put(`/challenges/${route.params.id}/test-cases/${tc._id}`, {
                    language: tc.language,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput
                });
                console.log('BECAME PUT')
            }
        }
        clearTestCaseEditorCache();
    } catch (err) {
        console.log('Failed to save/delete multiple test cases:', err);
    }
}

function stageEmptyTestCase(language) {
    try {
        testCases.value.unshift({
            language: language,
            input: '',
            expectedOutput: '',
        })
        newTestCaseCounter++;
    } catch (err) {
        console.log('Error when staging new test case:', err);
    }
}

function clearTestCaseEditorCache() {
    console.log('CLEARING');
    flaggedTestCases = [];
    newTestCaseCounter = 1;
}

// ***********************************************************
// Syntax highlighting customization, generated from careful prompting of Gemini.
const myHighlightStyle = HighlightStyle.define([
  // Fallback for names and default text
  { tag: tags.name, color: "#F2F2F2" },
  
  // Comments (italic and a warm gray/peach)
  { tag: tags.comment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.lineComment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.blockComment, color: "#9E9E9E", fontStyle: "italic" },
  { tag: tags.docComment, color: "#A8D1A8", fontStyle: "italic" }, // Slightly different for doc

  // Keywords (bright magenta/pink)
  { tag: tags.keyword, color: "#C792EA" },
  { tag: tags.self, color: "#C792EA" }, // self, this
  { tag: tags.null, color: "#C792EA" }, // null, None
  { tag: tags.atom, color: "#C792EA" }, // true, false
  { tag: tags.controlKeyword, color: "#FF5370" }, // if, for, while, return, break, continue
  { tag: tags.definitionKeyword, color: "#C792EA" }, // const, let, var, function, class, def, import, export
  { tag: tags.moduleKeyword, color: "#C792EA" }, // import, export, from

  // Operators (reddish-orange)
  { tag: tags.operator, color: "#FF9F00" },
  { tag: tags.operatorKeyword, color: "#C792EA" }, // in, instanceof, is, not, and, or
  { tag: tags.definitionOperator, color: "#FF9F00" }, // = (assignment)
  { tag: tags.compareOperator, color: "#FF9F00" }, // ==, <, >
  { tag: tags.arithmeticOperator, color: "#FF9F00" }, // +, -, *

  // Punctuation (slightly muted white)
  { tag: tags.punctuation, color: "#B3B3B3" },
  { tag: tags.separator, color: "#B3B3B3" }, // commas, semicolons

  // Brackets/Braces/Parens (default white)
  { tag: tags.bracket, color: "#F2F2F2" },
  { tag: tags.paren, color: "#F2F2F2" },
  { tag: tags.brace, color: "#F2F2F2" },
  { tag: tags.squareBracket, color: "#F2F2F2" },

  // Literals
  { tag: tags.literal, color: "#FFCB6B" },
  { tag: tags.string, color: "#C3E88D" }, // Light green for strings
  { tag: tags.docString, color: "#80C280" }, // Slightly darker green for doc strings
  { tag: tags.escape, color: "#FF5370" }, // Red/pink for escape sequences
  { tag: tags.number, color: "#F78C6C" }, // Coral/orange for numbers
  { tag: tags.integer, color: "#F78C6C" },
  { tag: tags.float, color: "#F78C6C" },
  { tag: tags.bool, color: "#C792EA" }, // Boolean literals (true/false)

  // Names
  { tag: tags.variableName, color: "#80CBC4" }, // Teal for variables
  { tag: tags.definition(tags.variableName), color: "#F2F2F2" }, // Variable definition, slightly whiter
  { tag: tags.function(tags.variableName), color: "#82AAFF" }, // Blue for function/method calls
  { tag: tags.function(tags.propertyName), color: "#82AAFF" }, // Blue for method calls (JS)
  { tag: tags.propertyName, color: "#F2F2F2" }, // Property access, default white

  // Definitions
  { tag: tags.className, color: "#FFCB6B" }, // Yellow/gold for class names
  { tag: tags.typeName, color: "#FFCB6B" }, // Type names (JS/Python type hints)

  // Invalid/Meta
  { tag: tags.invalid, color: "#FF5370", textDecoration: "underline" },
  { tag: tags.meta, color: "#80CBC4" } // e.g., preprocessor directives
]);

const extensions = [syntaxHighlighting(myHighlightStyle)];

onMounted(async () => {
    await loadWorkspace();
})

</script>


<style>
    .test-cases-modal * {
        border: unset !important;
    }

    .test-cases-modal .btn-close {
        filter: brightness(0) saturate(100%) invert(70%) sepia(0%) saturate(0%) hue-rotate(206deg) brightness(88%) contrast(85%);
    }

    .test-cases-modal .btn-close:hover {
        filter: brightness(0) saturate(100%) invert(100%) sepia(10%) saturate(3129%) hue-rotate(188deg) brightness(124%) contrast(100%);
    }

    .test-cases-modal .btn-secondary,
    .test-cases-modal .btn-primary {
        background-color: unset;
        border: 2px var(--text-light) solid !important;
        font-family: 'JetBrains Mono', monospace;
    }

    .test-cases-modal .btn-secondary:hover {
        color: var(--amber-primary);
        background-color: unset;
    }

    .test-cases-modal .btn-primary:hover {
        color: var(--neon-cyan);
        background-color: unset;
    }
    
    .test-cases-modal .modal-content {
        background-color: var(--dark-bg) !important;
        border: 2px var(--text-light) solid !important;
        padding-right: 4px;
    }

    .test-cases-modal .modal-body::-webkit-scrollbar {
    width: 8px;
    }

    .test-cases-modal .modal-body::-webkit-scrollbar-track {
    background: unset;
    }

    .test-cases-modal .modal-body::-webkit-scrollbar-thumb {
    background-color: var(--card-bg);
    border-radius: 5px;
    border: 1px var(--text-muted) solid;
    }

    .test-cases-modal .modal-body::-webkit-scrollbar-thumb:hover {
    background-color: var(--section-bg);
    }

    #edit-tests-btn {
        margin-left: auto;
        font-family: 'JetBrains Mono', monospace !important;
        background-color: unset !important;
        border: 2px solid var(--text-muted) !important;
        width: 130px;
        color: var(--text-muted) !important;
    }

    #edit-tests-btn:hover {
        color: var(--neon-cyan) !important;
        border-color: white !important;
    }

    .all-buttons .btn {
        font-family: 'JetBrains Mono', monospace !important;
        background-color: unset !important;
        border: 2px solid var(--text-muted) !important;
        width: 130px;
        color: var(--text-muted) !important;
    }

    @media (min-width: 768px) {
        #all-buttons {
            margin-top: calc(43.2px + 1rem);
        }
    }

    .all-buttons .btn:hover {
        color: white !important;
        border-color: white !important;
    }

    .nav-pills .nav-link {
        background-color: unset !important;
        border: 2px solid var(--text-muted) !important;
        color: var(--text-muted) !important;
        margin-right: 1rem;
        font-family: 'JetBrains Mono', monospace !important;
    }

    .nav-pills .nav-link.active {
        color: var(--amber-primary) !important;
        border-color: white !important;
    }

    .nav-pills .nav-link:hover {
        color: white !important;
    }

    .nav-pills .nav-link.active:hover {
        color: var(--amber-primary) !important;
    }

    .editor-wrapper {
        position: relative;
        width: 100%;
    }

    .code-feedback-alert {
        position: absolute !important;
        bottom: 0;           
        left: 0;
        margin: unset !important;
        width: 100%;      
    }

    .coding-window {
        text-align: left !important;
        position: relative !important;
    }

    .coding-tabs {
        margin-bottom: 0.25rem;
    }
    
    .cm-editor {
        height: 100vh;
        border: 2px solid white;
        border-radius: 8px;
        overflow: hidden;
        min-height: 100px;
        max-height: 70vh;
    }

    

    .cm-gutters, .cm-activeLineGutter{
        background-color: var(--dark-bg) !important;
        border-right-color: var(--section-background) !important;
    }
    
    .cm-cursor {
        border-left-color: var(--light-blue) !important;
    }

    .cm-activeLine {
        background-color: unset !important;
    }

    .cm-selectionBackground {
        /* Subtle blue/grey selection color for general selected text */
        background-color: var(--light-blue-vague) !important;
    }
</style>


