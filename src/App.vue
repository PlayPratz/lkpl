<template>
  <v-app>
    <v-app-bar flat density="compact">
      <v-btn icon="mdi-chevron-left" v-if="selectedSeason" @click="onSetSeason(null)" />
      <v-app-bar-title v-if="selectedSeason">Season {{ selectedSeason.year }}</v-app-bar-title>
      <v-app-bar-title v-else>Select a Season</v-app-bar-title>
      <!-- <a v-if="!isLoading" :href="getLatestMatchLink(season.year)" target="_blank" class="text-secondary">
        <v-btn class="rounded-pill" variant="outlined">
          <small>{{ getLatestMatchString() }}</small>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </a> -->
      <v-btn @click="toggleTheme" icon="mdi-theme-light-dark" class="ms-2" />
    </v-app-bar>
    <v-main>
      <SeasonPoints v-if="selectedSeason" :season="selectedSeason" />
      <div v-else class="text-center">
        <v-list lines="one">
          <v-list-item v-for="season in SEASONS" :key="season.year" @click="() => onSetSeason(season)">
            <v-list-item-content>
              <v-list-item-title>{{ season.year }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-main>
    <v-fab app color="primary" location="bottom right" icon="mdi-arrow-up" @click="scrollToTop"
      :active="!isScrolledTop" />
    <!-- <v-bottom-navigation mode="shift" value="leaderboard" mandatory="force" @update:model-value="(v) => console.log(v)">
      <v-btn value="leaderboard">
        <v-icon>mdi-format-list-numbered</v-icon>
        <span>Leaderboard</span>
      </v-btn>

      <v-btn value="stats">
        <v-icon>mdi-chart-bar</v-icon>
        <span>Stats</span>
      </v-btn>
    </v-bottom-navigation> -->
    <v-footer>
      <div class="text-caption">
        <span class="text-disabled">developed by</span>
        <span class="text-decoration-none on-surface">
          Pratik Nerurkar
        </span>
      </div>
    </v-footer>
  </v-app>



</template>

<script setup lang="ts">
import { THEME } from './logic/theme';
import { ref } from 'vue';
import { type Season, SEASONS } from './logic/teams';
import SeasonPoints from './components/SeasonPoints.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';

  THEME.saveTheme(theme.global.current.value.dark ? 1 : 0);
}

const selectedSeason = ref<Season | null>(null);

const isScrolledTop = ref(true);
addEventListener("scroll", () => {
  isScrolledTop.value = scrollY === 0;
});
function scrollToTop() {
  scrollTo({ top: 0 });
}

function onSetSeason(s: Season | null) {
  selectedSeason.value = s;
}

</script>