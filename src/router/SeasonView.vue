<template>
    <div v-if="isLoading" class="text-center my-16">
        <v-progress-circular indeterminate />
        <br />
        <br />
        <span>Fetching Fantasy Points...</span>
    </div>
    <div v-else>
        <Leaderboard :teampoints="teamPoints" />
        <TeamBreakdown v-for="team in teamPoints" :props="{
            fantasyPlayers,
            teamPoint: team,
            replacements: season.replacements
        }" />
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchLatestPoints, getLatestMatchNumber, type FantasyPlayers } from '../logic/fantasy-player';
import { calculatePointsForTeam, calculatePreviousPointsForTeam, SEASONS, type TeamWithPoints } from '../logic/teams';
import Leaderboard from '../components/Leaderboard.vue';
import TeamBreakdown from '../components/TeamBreakdown.vue';
import { router } from '@/router';

const year = +router.currentRoute.value.params.year;
const season = SEASONS[year];

if (!season) {
    router.replace("/lkpl");
}

const isLoading = ref(true);
const teamPoints: TeamWithPoints[] = [];
let fantasyPlayers: FantasyPlayers;

fetchLatestPoints(season.year)
    .then((fp) => {
        console.log(fp)
        for (const team of season.teams) {
            teamPoints.push({
                ...team,
                points: calculatePointsForTeam(team, fp, season.replacements),
                previousPoints: calculatePreviousPointsForTeam(team, fp, season.replacements)
            })
            fantasyPlayers = fp;
        }

        teamPoints.sort((t1, t2) => t2.points - t1.points)
        isLoading.value = false;
    });

function getLatestMatchString() {
    const matchNumber = getLatestMatchNumber();
    switch (matchNumber) {
        case "71": return "Qualifier 1";
        case "72": return "Eliminator";
        case "73": return "Qualifier 2";
        case "74": return "Final";
        default: return `Match ${matchNumber}`;
    }
}

</script>
