import { createRouter, createWebHashHistory } from "vue-router";

import SeasonView from "./SeasonView.vue";
import SeasonSelectView from "./SeasonSelectView.vue";

const routes = [
    // { path: '/lkpl', redirect: '/lkpl/seasons' },
    { path: "/seasons", name: "season-select", component: SeasonSelectView },
    {
        path: "/seasons/:year/:team?",
        name: "season-view",
        component: SeasonView,
    },
    { path: "/:pathMatch(.*)*", redirect: "/seasons" },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
