import { createRouter, createWebHistory } from 'vue-router'

import SeasonView from './SeasonView.vue'
import SeasonSelectView from './SeasonSelectView.vue'

const routes = [
    // { path: '/lkpl', redirect: '/lkpl/seasons' },
    { path: '/lkpl/seasons', name: "seasons", component: SeasonSelectView },
    { path: '/lkpl/seasons/:year', name: "seasonview", component: SeasonView },
    { path: '/:pathMatch(.*)*', redirect: '/lkpl/seasons' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})