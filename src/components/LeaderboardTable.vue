<template>
    <v-container id="leaderboard">
        <v-sparkline
            v-if="seasonOverview.commenced"
            type="bar"
            auto-draw
            smooth
            line-width="8"
            :gradient="gradient"
            gradient-direction="right"
            :model-value="teams.map((t) => t.points)"
            :labels="teams.map((t) => t.team_owner)"
            label-size="5"
        >
        </v-sparkline>
        <v-card class="mt-2 bg-primary" border="primary sm opacity-100">
            <v-table hover>
                <thead>
                    <tr class="bg-primary">
                        <th>#</th>
                        <th>Name</th>
                        <th>Points</th>
                        <th>Lead</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in teams" :key="t.team">
                        <td>
                            {{ t.rank }}
                            <small
                                v-if="t.recent_rank_gain > 0"
                                class="text-success"
                            >
                                (+{{ t.recent_rank_gain }})
                            </small>
                            <small
                                v-else-if="t.recent_rank_gain < 0"
                                class="text-error"
                            >
                                (-{{ t.recent_rank_gain }})
                            </small>
                            <small v-else class="text-grey">
                                ({{ t.recent_rank_gain }})
                            </small>
                        </td>
                        <td>
                            <router-link
                                v-if="canClick[t.team_owner]"
                                class="text-primary text-decoration-none"
                                :to="{
                                    name: 'season-view',
                                    params: { team: t.team_owner },
                                    replace: true,
                                }"
                            >
                                {{ t.team_owner.toUpperCase() }}
                                <v-icon
                                    class="text-secondary"
                                    icon="mdi-arrow-right-thin"
                                />
                            </router-link>
                            <v-else v-else>
                                {{ t.team_owner.toUpperCase() }}
                            </v-else>
                        </td>
                        <td>
                            {{ t.points }}
                            <small
                                v-if="t.recent_points > 0"
                                class="text-success"
                            >
                                (+{{ t.recent_points }})
                            </small>
                            <small
                                v-else-if="t.recent_points < 0"
                                class="text-error"
                            >
                                (-{{ t.recent_points }})
                            </small>
                            <small v-else class="text-grey">
                                ({{ t.recent_points }})
                            </small>
                        </td>
                        <td>
                            <small v-if="leads[t.team]" class="text-warning">
                                +{{ leads[t.team] }}
                            </small>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import type { SeasonOverview } from "@/api/fantasy-league";
    import { RouterLink } from "vue-router";

    const props = defineProps<{
        seasonOverview: SeasonOverview;
        canClick: Record<string, boolean>;
    }>();
    const teams = props.seasonOverview.teams;

    const leads: Record<string, number> = {};
    for (let i = 0; i < teams.length - 1; i++) {
        leads[teams[i].team] = teams[i].points - teams[i + 1].points;
    }

    const gradient = ["#f72047", "#ffd200", "#1feaea"];
</script>
