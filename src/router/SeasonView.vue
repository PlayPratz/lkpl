<template>
    <div v-if="!seasonOverview" class="text-center my-16">
        <v-progress-circular indeterminate />
        <br />
        <br />
        <span>Loading Fantasy Season...</span>
    </div>
    <div v-else>
        <leaderboard-table
            :season-overview="seasonOverview"
            :leads="leads"
            :can-click="canClick"
        />
        <team-breakdown
            v-for="team in seasonOverview.teams"
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
    import { onMounted, onUnmounted, ref, watch } from "vue";
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

    const canClick = ref<Record<string, boolean>>({});
    const seasonOverview = ref<SeasonOverview>();

    const leads: Record<string, number> = {};

    watch(
        () => +route.params.year,
        async (year, prevYear, onCleanup) => {
            // const year = route.params.year;
            // if (year === prevYear) return;
            seasonOverview.value = undefined;
            const seasonList = await getSeasonList();

            const season = seasonList.find((sn) => sn.season_year === +year);
            if (season) {
                document.title = `Season ${season!.season_year} | LKPL Fantasy`;
                const controller = { stop: false };
                refreshSeasonOverview(season, controller);
                onCleanup(() => {
                    controller.stop = true;
                });
            } else {
                console.log("Bruh");
                router.replace({ name: "select-season" });
            }
        },
        { immediate: true },
    );

    async function refreshSeasonOverview(
        season: Season,
        controller: { stop: boolean },
    ) {
        if (controller.stop) return;

        const so = await getSeasonOverview(season.name);
        so.teams.sort((a, b) => a.rank - b.rank);

        for (let i = 0; i < so.teams.length - 1; i++) {
            leads[so.teams[i].team] =
                so.teams[i].points - so.teams[i + 1].points;
        }

        seasonOverview.value = so;
        setTimeout(refreshSeasonOverview, 10000, season, controller);
    }

    watch(
        () => route.params.team,
        (team) => {
            if (team) {
                scrollToTeam((team as string).toLowerCase());
            }
            // else {
            //     scrollTo({ top: 0 });
            // }
        },
        { immediate: true },
    );

    let shouldResetTeamParam = true;

    function setResetTeamParam() {
        shouldResetTeamParam = true;
    }

    function resetTeamParam() {
        if (shouldResetTeamParam) {
            router.replace({
                name: "season-view",
                params: { team: undefined },
            });
        }
    }

    onMounted(() => {
        addEventListener("scrollend", setResetTeamParam);
        addEventListener("scroll", resetTeamParam);
    });

    onUnmounted(() => {
        removeEventListener("scrollend", setResetTeamParam);
        removeEventListener("scroll", resetTeamParam);
    });

    function scrollToTeam(team: string) {
        const element = document.getElementById(team.toLowerCase());
        if (element) {
            shouldResetTeamParam = false;
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

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

    function setCanClick(team: Team) {
        canClick.value[team.team_owner] = true;
        const teamParam = route.params.team as string | undefined;
        if (teamParam?.toLowerCase() === team.team_owner.toLowerCase()) {
            scrollToTeam(team.team_owner);
        }
    }
</script>
