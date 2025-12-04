import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Challenge from './views/Challenge.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/challenges/:id', name: 'Challenge', component: Challenge}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
