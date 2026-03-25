<template>
    <v-list lines="one" class="my-auto text-center">
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
            return sessionSeason;
        }
        const fetchSeason = await getSeasonList();
        saveSeasons(fetchSeason);
        return fetchSeason;
    }
</script>
