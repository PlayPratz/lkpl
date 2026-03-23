<template>
    <div v-if="isLoading" class="text-center my-16">
        <v-progress-circular indeterminate />
        <br />
        <br />
        <span>Fetching Fantasy Points...</span>
    </div>
    <div v-else>
        <leaderboard :teampoints="teamPoints" :can-click="canClick" />
        <team-breakdown v-for="team in teamPoints.filter((t) => t.retentions !== null)" :props="{
            fantasyPlayers,
            teamPoint: team,
            replacements: season.replacements,
            setCanClick: setCanClick
        }" />
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchLatestPoints, type FantasyPlayers } from '../logic/fantasy-player';
import { calculatePointsForTeam, calculatePreviousPointsForTeam, getPlayersIdsForTeam, SEASONS, type TeamWithPoints } from '../logic/teams';
import Leaderboard from '../components/Leaderboard.vue';
import TeamBreakdown from '../components/TeamBreakdown.vue';
import { router } from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();
const year = +route.params.year;
const season = SEASONS[year];

document.title = `Season ${season.year} | LKPL Fantasy`;

if (!season) {
    router.replace({ name: 'seasons' });
}

const canClick = ref<Record<string, boolean>>({});

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

// function getLatestMatchString() {
//     const matchNumber = getLatestMatchNumber();
//     switch (matchNumber) {
//         case "71": return "Qualifier 1";
//         case "72": return "Eliminator";
//         case "73": return "Qualifier 2";
//         case "74": return "Final";
//         default: return `Match ${matchNumber}`;
//     }
// }

watch(() => route.params.team, (team) => {
    console.debug("Team param changed:", team);
    if (team) {
        scrollToTeam(team as string);
    }
})

function scrollToTeam(team: string) {
    const element = document.getElementById(team.toLocaleLowerCase());
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setCanClick(team: TeamWithPoints) {
    canClick.value[team.name] = true;
    if (route.params.team === team.name.toLocaleLowerCase()) {
        scrollToTeam(team.name);
    }
}

</script>
