<template>
    <BContainer class="coding-window-container">
        <BTabs class="coding-tabs" v-model:index="activeTabIndex" content-class="mt-3">
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
        </BTabs>
        <div class = "mt-2">
            <BButton @click="runCode" class="run-button">Run</BButton>
            <BButton class="submit-button" :disabled="!submittable" @click="submitCode">Submit</BButton>
        </div>

        
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

const route = useRoute();

const props = defineProps({
    pythonCodeTemplate: {type: String, required: true},
    javascriptCodeTemplate: {type: String, required: true}
});

// ************************** REACTIVE VARIABLES
const pythonCode = ref(props.pythonCodeTemplate);
const javascriptCode = ref(props.javascriptCodeTemplate); 
const activeTabIndex = ref(0); 
const lang = ref(python());
const alertMessage = ref('');
const showAlert = ref(false);
const alertVariant = ref('');

const submittable = ref(false);
const draftSaved = ref(false);

// *************************** OBSERVERS
watch(() => props.pythonCodeTemplate, (newTemplate) => {
    if (!pythonCode.value) {
        pythonCode.value = newTemplate;
    }
});
watch(() => props.javascriptCodeTemplate, (newTemplate) => {
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


        const response = await Api.post('/drafts', {
            code: userCode, language: language, id: route.params.id
        })
        const { passed, message, newSubmission } = response.data;

        if (passed) {
            draftSaved.value = true;
            submittable.value = true;  
            alertMessage.value = message;
            alertVariant.value = 'success';
            showAlert.value = true;
        } else {
            draftSaved.value = false;
            submittable.value = false;
            alertMessage.value = response.data.message;
            alertVariant.value = 'danger';
            showAlert.value = true;
        }
    } catch (err) {
        alertMessage.value = 'Error posting to drafts: ' + err;
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
        const response = await Api.post(`/submissions`, {
            title,
            authorNote,
            challengeId: route.params.id,
        });

        alert("Submission created successfully! ID: " + response.data._id);

        submittable.value = false;
        draftSaved.value = false;
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
    console.log('Saving workspace');
    try {
        const response = await Api.put(`workspaces?challId=${route.params.id}`, {
            pythonCode: pythonCode.value, javascriptCode: javascriptCode.value
        });
        console.log('Saved workspace');
    } catch (err) {
        console.log(`Failed saving workspace: ${err}`);
    }
}

async function resetWorkspaceToDefault() {
    try {
        response = await Api.put(`workspaces?challId=${route.params.id}`, {
        pythonCode: pythonCodeTemplate.value, javascriptCode: javascriptCodeTemplate.value
        });
        pythonCode.value = pythonCodeTemplate.value;
        javascriptCode.value = javascriptCodeTemplate.value;
    } catch (err) {
        console.log(`Failed to reset workspace to default: ${err}`);
    }
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
    .coding-window-container {
        height: calc(80vh);
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

    .run-button {
        margin-right: 2rem;
        background-color: var(--dark-bg) !important;
    }

    .run-button:hover {
        background-color: var(--card-bg) !important;
    }

    .submit-button {
        background-color: var(--dark-bg) !important;
    }

    .submit-button:hover {
        background-color: var(--card-bg) !important;
    }

    .coding-window {
        text-align: left !important;
        position: relative !important;
    }

    .coding-tabs {
        margin-bottom: 0.25rem;
    }
    
    .cm-editor {
        height: 500px;
        border: 2px solid white;
        border-radius: 8px;
        overflow: hidden;
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


