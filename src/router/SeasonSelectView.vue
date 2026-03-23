<template>
    <div class="text-center">
        <v-list lines="one">
            <v-list-item v-for="season in SEASONS" :key="season.year">
                <RouterLink :to="{ name: 'seasonview', params: { year: season.year } }"
                    class="text-decoration-none text-body">
                    <v-list-item-title>{{ season.year }}</v-list-item-title>
                </RouterLink>

            </v-list-item>
        </v-list>
    </div>
</template>


<script setup lang="ts">
import { SEASONS } from '@/logic/teams';

</script>