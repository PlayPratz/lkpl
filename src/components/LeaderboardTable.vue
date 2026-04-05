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
                        <template v-if="seasonOverview.commenced">
                            <th>#</th>
                            <th width="50%">Team</th>
                            <th>Points</th>
                            <th>Lead</th>
                        </template>
                        <template v-else>
                            <th class="d-none d-sm-table-cell">ID</th>
                            <th width="50%">Team</th>
                            <th>
                                Purse (₹cr)
                                <!-- <br />
                                <v-icon icon="mdi-cash" /> -->
                            </th>
                            <th>
                                Slots
                                <!-- <br />
                                <v-icon icon="mdi-playlist-check" /> -->
                            </th>
                            <th>
                                Retn
                                <!-- <br />
                                <v-icon icon="mdi-repeat" color="warning" /> -->
                            </th>
                            <th>
                                Buys
                                <!-- <br />
                                <v-icon icon="mdi-gavel" color="secondary" /> -->
                            </th>
                            <th>
                                Ovs
                                <!-- <br />
                                <v-icon icon="mdi-airplane" /> -->
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in props.seasonOverview.teams" :key="t.team">
                        <td v-if="seasonOverview.commenced">
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
                                ({{ t.recent_rank_gain }})
                            </small>
                            <small v-else class="text-grey">
                                ({{ t.recent_rank_gain }})
                            </small>
                        </td>
                        <td v-else class="d-none d-sm-table-cell">
                            {{ t.team.slice(6) }}
                        </td>
                        <td class="py-2 text-center text-sm-left">
                            <router-link
                                class="text-primary text-decoration-none"
                                :to="{
                                    name: 'season-view',
                                    params: { team: t.team_owner },
                                    replace: true,
                                }"
                            >
                                <v-avatar
                                    style="width: 48px; height: 48px"
                                    :image="getTeamOwnerImageUrl(t)"
                                    border="primary sm opacity-25"
                                />
                                <br class="d-sm-none" />
                                <span class="px-sm-4">
                                    {{ t.team_owner.toUpperCase() }}</span
                                >

                                <!-- <v-icon
                                    class="text-secondary"
                                    icon="mdi-arrow-right-thin"
                                /> -->
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
    import {
        getTeamOwnerImageUrl,
        type SeasonOverview,
    } from "@/api/fantasy-league";
    import { RouterLink } from "vue-router";

    const props = defineProps<{
        seasonOverview: SeasonOverview;
        leads: Record<string, number>;
    }>();

    const gradient = ["#f72047", "#ffd200", "#1feaea"];
</script>
