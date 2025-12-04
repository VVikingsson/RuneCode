import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Leaderboard from '@/components/Leaderboard.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/leaderboard', component: Leaderboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
