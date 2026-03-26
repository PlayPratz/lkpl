<template>
    <v-container id="leaderboard" class="fl-container">
        <v-sparkline
            v-if="seasonOverview.commenced"
            type="bar"
            auto-draw
            smooth
            line-width="8"
            :gradient="gradient"
            gradient-direction="right"
            :model-value="props.seasonOverview.teams.map((t) => t.points)"
            :labels="props.seasonOverview.teams.map((t) => t.team_owner)"
            label-size="5"
        />
        <v-card class="mt-2 bg-primary" border="primary sm opacity-100">
            <v-table hover>
                <thead>
                    <tr class="bg-primary">
                        <th>#</th>
                        <th>Name</th>
                        <template v-if="seasonOverview.commenced">
                            <th>Points</th>
                            <th>Lead</th>
                        </template>
                        <template v-else>
                            <th>Purse Remaining (₹cr)</th>
                            <th>Slots Remaining</th>
                            <th>Retentions</th>
                            <th>Auction Buys</th>
                            <th>Overseas Players</th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in props.seasonOverview.teams" :key="t.team">
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
                        </td>
                        <template v-if="seasonOverview.commenced">
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
                                <small
                                    v-if="leads[t.team]"
                                    class="text-warning"
                                >
                                    +{{ leads[t.team] }}
                                </small>
                            </td>
                        </template>
                        <template v-else>
                            <td>
                                {{ t.purse_remaining }}
                            </td>
                            <td>
                                {{ t.slots_remaining }}
                            </td>
                            <td>
                                {{ t.players_retained }}
                            </td>
                            <td>
                                {{ t.players_bought }}
                            </td>
                            <td>
                                {{ t.overseas_players }}
                            </td>
                        </template>
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
    }>();

    const leads: Record<string, number> = {};
    for (let i = 0; i < props.seasonOverview.teams.length - 1; i++) {
        leads[props.seasonOverview.teams[i].team] =
            props.seasonOverview.teams[i].points -
            props.seasonOverview.teams[i + 1].points;
    }

    const gradient = ["#f72047", "#ffd200", "#1feaea"];
</script>
