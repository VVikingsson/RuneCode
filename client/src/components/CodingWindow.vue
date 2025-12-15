<template>
    <BContainer class="coding-window-container">
        <BTabs class="coding-tabs" v-model:index="activeTabIndex" content-class="mt-3">
        <BTab class="coding-tab" title="Python" active>
            <code-mirror
                class="coding-window"
                v-model="pythonCode"
                basic
                :lang="lang"
                :tab="true"
                :tab-size="4"
                :allow-multiple-selections="true"
                :extensions="extensions"
                autofocus
            />
        </BTab>
        <BTab class="coding-tab" title="Javascript">
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
import { defineProps, ref, watch} from 'vue';
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

// reactive variables
const pythonCode = ref(props.pythonCodeTemplate);
const javascriptCode = ref(props.javascriptCodeTemplate); 
const activeTabIndex = ref(0); 
const lang = ref(python());

// Observers
watch(() => props.pythonCodeTemplate, (newTemplate) => {
    pythonCode.value = newTemplate;
});
watch(() => props.javascriptCodeTemplate, (newTemplate) => {
    javascriptCode.value = newTemplate;
});
watch(() => activeTabIndex.value, (index) => {
    lang.value = [python(), javascript()][index];
});

// --------------
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

</script>

<style>
    .coding-window {
        text-align: left !important;
    }

    
    .cm-editor {
        height: 500px;
        border: 2px solid white;
        border-radius: 8px;
    }

    

    .cm-gutters, .cm-activeLineGutter{
        background-color: var(--dark-bg) !important;
        border-right-color: var(--section-background) !important;
    }
    
    .cm-cursor {
        border-left-color: var(--light-blue) !important;
    }

    .coding-window-container {
        height: calc(100vh - 80px);
    }

    .cm-activeLine {
        background-color: unset !important;
    }

    .cm-selectionBackground {
        /* Subtle blue/grey selection color for general selected text */
        background-color: var(--light-blue-vague) !important;
    }
</style>


