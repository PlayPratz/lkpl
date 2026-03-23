import { createRouter, createWebHashHistory } from 'vue-router'

import SeasonView from './SeasonView.vue'
import SeasonSelectView from './SeasonSelectView.vue'

const routes = [
    // { path: '/lkpl', redirect: '/lkpl/seasons' },
    { path: '/seasons', name: "seasons", component: SeasonSelectView },
    { path: '/seasons/:year', name: "season-view", component: SeasonView },
    { path: '/seasons/:year/:team', name: "season-team", component: SeasonView },
    { path: '/:pathMatch(.*)*', redirect: '/seasons' },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})