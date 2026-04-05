import { createRouter, createWebHashHistory } from "vue-router";

import SeasonView from "./SeasonView.vue";
import SelectSeasonView from "./SelectSeasonView.vue";

const routes = [
    // { path: '/lkpl', redirect: '/lkpl/seasons' },
    { path: "/seasons", name: "select-season", component: SelectSeasonView },
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
