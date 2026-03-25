<template>
    <div v-if="isLoading" class="text-center my-16">
        <v-progress-circular indeterminate />
        <br />
        <br />
        <span>Fetching Fantasy Points...</span>
    </div>
    <div v-else>
        <leaderboard-table
            :season-overview="seasonOverview"
            :can-click="canClick"
        />
        <team-breakdown
            v-for="team in seasonOverview.teams.filter(
                (t) => t.players.length > 0,
            )"
            :key="team.team"
            :commenced="seasonOverview.commenced"
            :team="team"
            :sort="sort"
            :on-sort-by="onSortBy"
            :set-can-click="setCanClick"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, watch } from "vue";
    import LeaderboardTable from "../components/LeaderboardTable.vue";
    import TeamBreakdown from "../components/TeamBreakdown.vue";
    import { router } from "@/router";
    import { useRoute } from "vue-router";
    import {
        getSeasonList,
        getSeasonOverview,
        type Season,
        type SeasonOverview,
        type Team,
    } from "@/api/fantasy-league";

    const route = useRoute();
    const year = +route.params.year;

    const canClick = ref<Record<string, boolean>>({});
    const isLoading = ref(true);

    let season: Season;
    let seasonOverview: SeasonOverview;

    getSeasonList().then((sl) => {
        const s = sl.find((s) => s.season_year == year);
        if (!s) {
            router.replace({ name: "seasons" });
        }
        season = s!;
        document.title = `Season ${season!.season_year} | LKPL Fantasy`;

        getSeasonOverview(season!.name).then((so) => {
            seasonOverview = so;
            seasonOverview.teams.sort((a, b) => a.rank - b.rank);
            isLoading.value = false;
        });
    });

    type sortParameter = "slot" | "playername" | "points" | "price" | "iplTeam";

    type SortSettings = {
        parameter: sortParameter;
        direction: number;
    };

    const sort = ref<SortSettings>({ parameter: "slot", direction: 1 });
    function onSortBy(parameter: sortParameter): void {
        if (sort.value.parameter == parameter) {
            sort.value.direction = sort.value.direction * -1;
        } else {
            sort.value = {
                parameter,
                direction: 1,
            };
        }
    }

    watch(
        () => route.params.team,
        (team) => {
            if (team) {
                scrollToTeam(team as string);
            }
        },
    );
    function scrollToTeam(team: string) {
        const element = document.getElementById(team);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function setCanClick(team: Team) {
        canClick.value[team.team_owner] = true;
        if (route.params.team === team.team_owner.toLocaleLowerCase()) {
            scrollToTeam(team.team_owner);
        }
    }
</script>
