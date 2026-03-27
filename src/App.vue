<template>
    <v-app class="some-class">
        <v-app-bar flat density="compact" color="secondary">
            <v-btn
                v-if="selectedSeason"
                icon="mdi-chevron-left"
                :to="{ name: 'season-select' }"
            />
            <v-app-bar-title v-if="selectedSeason"
                >Season {{ selectedSeason }}</v-app-bar-title
            >
            <v-app-bar-title v-else>Select a Season</v-app-bar-title>
            <!-- <a v-if="!isLoading" :href="getLatestMatchLink(season.year)" target="_blank" class="text-secondary">
        <v-btn class="rounded-pill" variant="outlined">
          <small>{{ getLatestMatchString() }}</small>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </a> -->
            <v-btn
                class="rounded-pill"
                variant="outlined"
                prepend-icon="mdi-theme-light-dark"
                @click="toggleTheme"
            >
                Dark Mode
            </v-btn>
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
        <v-fab
            app
            color="secondary"
            location="bottom right"
            icon="mdi-arrow-up"
            :active="!isScrolledTop"
            @click="scrollToTop"
        />
        <v-footer class="text-label-medium" style="max-height: 32px">
            <span class="text-disabled">developed by</span>
            <span class="text-decoration-none on-surface ms-1">
                Pratik Nerurkar
            </span>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
    import { THEME } from "./styles/theme";
    import { ref, watch } from "vue";
    import { useRoute } from "vue-router";
    import { useTheme } from "vuetify";

    const theme = useTheme();
    function toggleTheme() {
        theme.global.name.value = theme.global.current.value.dark
            ? "light"
            : "dark";

        THEME.saveTheme(theme.global.current.value.dark ? 1 : 0);
    }

    const selectedSeason = ref<number | null>(null);
    const route = useRoute();

    watch(
        () => route.params.year,
        (year) => {
            selectedSeason.value = +year;
        },
    );

    const isScrolledTop = ref(true);
    addEventListener("scroll", () => {
        isScrolledTop.value = scrollY === 0;
    });
    function scrollToTop() {
        scrollTo({ top: 0 });
    }
</script>
