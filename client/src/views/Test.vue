<script setup>
import { ref, defineComponent} from 'vue';

// Load component
import CodeMirror from 'vue-codemirror6';

// CodeMirror extensions
import { javascript } from '@codemirror/lang-javascript';
/** text */
const value = ref('');

/** Dark mode **/
const dark = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

const lang = javascript();


</script>

<template>
  <code-mirror
    v-model="value"
    basic
    :dark="dark"
    :lang="lang"
    :phrases="phrases"
  />
</template>