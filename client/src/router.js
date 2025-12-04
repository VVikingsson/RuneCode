import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import Challenge from './views/Challenge.vue'
import Challenges from './views/Challenges.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/challenges', name: 'challenges', component: Challenges},
  { path: '/leaderboard', component: Leaderboard }
  { path: '/', name: 'home', component: Home },
  { path: '/challenges/:id', name: 'Challenge', component: Challenge}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
