<template>
    <v-list lines="one" class="my-auto text-center">
        <v-list-item
            v-for="season in Object.values(SEASONS).reverse()"
            :key="season.year"
            :to="{ name: 'season-view', params: { year: season.year } }"
            class="text-decoration-none pa-4"
        >
            <v-list-item-title class="text-headline-large">
                {{ season.year }}
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
    import { SEASONS } from "@/logic/teams";

    document.title = `LKPL Fantasy`;
</script>
