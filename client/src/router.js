import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Challenges from './views/Challenges.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/challenges', name: 'challenges', component: Challenges}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
