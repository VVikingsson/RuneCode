import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import Challenge from './views/Challenge.vue'
import User from './views/User.vue'
import Challenges from './views/Challenges.vue'
import test from './views/Test.vue';

const routes = [
  { path: '/test', name: 'test', component: test },
  { path: '/', name: 'home', component: Home },
  { path: '/leaderboard', component: Leaderboard },
  { path: '/challenges', name: 'challenges', component: Challenges},
  { path: '/leaderboard', component: Leaderboard },
  { path: '/', name: 'home', component: Home },
  { path: '/challenges/:id', name: 'Challenge', component: Challenge },
  { path: '/users/:id', name: 'User', component: User, props: true } // redirects you to a page of a specific user

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
