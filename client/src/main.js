// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { createPinia } from 'pinia';
import router from './router'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './assets/base.css';
import './assets/coding-window.css';

const app = createApp(App);
const pinia = createPinia();
app.use(createBootstrap());
app.use(router);
app.use(pinia);
app.mount('#app');
