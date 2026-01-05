<template>
    <code-mirror
        class="coding-window"
        v-model="submissionCode"
        basic
        :read-only="true"
        :lang="lang"
        :tab="true"
        :tab-size=4
        :allow-multiple-selections="true"
        :extensions="extensions"
    />
</template>

<script setup>
import { Api } from '@/Api'
import { defineProps, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { myHighlightExtension } from '@/codemirror/highlightStyle'

const extensions = [myHighlightExtension];

const lang = ref(python());
const submissionCode = ref('');

const props = defineProps({
    code: {type: String, default: "Unknown code"},
    language: {type: Object, default: python()}
})


watch(() => props.lang, (newLang) => {
    langProp.value = newLang || python();
})

watch(() => props.code, (newCode) => {
    submissionCode.value = newCode || 'Unknown code';
})

</script>