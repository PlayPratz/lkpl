<template>
    <v-list v-if="seasons" lines="one" class="h-100 text-center">
        <v-list-item
            v-for="season in seasons"
            :key="season.season_year"
            :to="{ name: 'season-view', params: { year: season.season_year } }"
            class="text-decoration-none pa-4"
        >
            <v-list-item-title class="text-headline-large">
                {{ season.league_name }} {{ season.season_year }}
            </v-list-item-title>
        </v-list-item>
    </v-list>
    <div v-else class="text-center my-16">
        <v-progress-circular indeterminate />
        <br />
        <br />
        <span>Loading...</span>
    </div>
</template>

<script setup lang="ts">
    import { getSeasonList, type Season } from "@/api/fantasy-league";
    import { loadSeasons, saveSeasons } from "@/store/store";
    import { ref } from "vue";

    document.title = `LKPL Fantasy`;
    const seasons = ref<Season[] | null>();

    fetchSeasonList().then((sns) => (seasons.value = sns));

    async function fetchSeasonList(): Promise<Season[]> {
        const sessionSeason = loadSeasons();
        if (sessionSeason) {
            return sessionSeason.reverse();
        }
        const fetchSeason = await getSeasonList();
        saveSeasons(fetchSeason);
        return fetchSeason;
    }
</script>
