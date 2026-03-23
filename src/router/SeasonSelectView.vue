<template>
    <v-list lines="one" class="my-auto text-center">
        <v-list-item v-for="season in Object.values(SEASONS).reverse()" :key="season.year"
            :to="{ name: 'seasonview', params: { year: season.year } }" class="text-decoration-none">
            <v-list-item-title class="text-headline-large">
                {{ season.year }}
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>


<script setup lang="ts">
import { SEASONS } from '@/logic/teams';
</script>