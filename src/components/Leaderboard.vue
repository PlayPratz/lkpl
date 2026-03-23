<template>
    <v-container>
        <v-sparkline type="bar" auto-draw smooth line-width="8" :gradient="gradient" gradient-direction="right"
            :model-value="teamRanks.map((t) => t.points)" :labels="teamRanks.map((t) => t.name)" label-size=5>
        </v-sparkline>
        <v-card class="bg-primary" border="primary sm opacity-100">
            <v-table hover>
                <thead>
                    <tr class="bg-primary">
                        <th>#</th>
                        <th>Name</th>
                        <th>Points</th>
                        <th>Lead</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in teamRanks">
                        <td>
                            {{ t.rank }}
                            <small :class="getGrowthClass(t.rankGrowth)">
                                ({{ getGrowthSign(t.rankGrowth) }}{{ t.rankGrowth }})
                            </small>

                        </td>
                        <td>
                            <router-link class="text-primary text-decoration-none" :to="{}">
                                {{ t.name }}
                                <v-icon class="text-secondary" icon="mdi-arrow-right-thin" />
                            </router-link>
                        </td>
                        <td>
                            {{ t.points }}
                            <small :class="getGrowthClass(t.growth)">
                                ({{ getGrowthSign(t.growth) }}{{ t.growth }})
                            </small>
                        </td>
                        <td>
                            <small class="text-warning">
                                {{ t.lead >= 0 ? `+${t.lead}` : '' }}
                            </small>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">

import { getGrowthClass, getGrowthSign } from "@/styles/styles";
import type { TeamWithPoints } from "../logic/teams";
import { RouterLink } from "vue-router";

const props = defineProps<{ teampoints: TeamWithPoints[] }>();
const teampoints = props.teampoints;

const ranks = getRanks(teampoints.map((tp) => tp.points));
const prevRanks = getRanks(teampoints.map((tp) => tp.previousPoints));

const teamRanks: {
    rank: number,
    rankGrowth: number,
    name: string,
    points: number,
    growth: number,
    lead: number,
}[] = teampoints
    .map((tp, i) => ({
        rank: ranks[i],
        rankGrowth: prevRanks[i] - ranks[i],
        name: tp.name,
        points: tp.points,
        lead: i < props.teampoints.length - 1 ? tp.points - props.teampoints[i + 1].points : -1,
        growth: tp.points - tp.previousPoints,
    }));


// console.log("Leaderboard:")
// console.log(teamRanks);

const gradient = ['#f72047', '#ffd200', '#1feaea'];

function getRanks(numbers: number[]): number[] {
    const sortedCopy = numbers.slice()
        .map((x, i) => ({ index: i, value: x }))
        .sort((a, b) => b.value - a.value);

    const ranks: Record<number, number> = {};

    for (let i = 0; i < sortedCopy.length; i++) {
        if (i > 0 && sortedCopy[i].value === sortedCopy[i - 1].value) {
            ranks[sortedCopy[i].index] = ranks[sortedCopy[i - 1].index];
        } else {
            ranks[sortedCopy[i].index] = i + 1;
        }
    }

    return Object.values(ranks);
}

</script>