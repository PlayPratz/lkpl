<template>
    <v-container :id="team.team_owner">
        <v-card border="primary sm opacity-100">
            <div class="py-2 text-center bg-primary">
                {{ team.team_owner.toUpperCase() }}
            </div>
            <v-table hover density="compact">
                <thead>
                    <tr class="text-primary">
                        <th style="width: 10%">#</th>
                        <th style="padding-left: 72px">Player</th>
                        <th style="width: 30%">Points</th>
                        <th class="d-none d-sm-table-cell" style="width: 15%">
                            Price (₹cr)
                        </th>
                        <th class="d-none d-sm-table-cell" style="width: 10%">
                            Team
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="q in team.players" :key="q.fantasy_player_id">
                        <td>
                            {{ q.slot_number }}
                            <v-badge
                                v-if="q.type === 'Retention'"
                                inline
                                icon="mdi-repeat"
                                color="warning"
                            />
                        </td>
                        <td>
                            <div class="d-flex align-items-center my-1">
                                <v-avatar
                                    style="width: 48px; height: 48px"
                                    :image="
                                        getPlayerImageUrl(q.fantasy_player_id)
                                    "
                                    border="primary sm opacity-25"
                                    :badge="
                                        q.overseas
                                            ? {
                                                  dot: false,
                                                  location: 'bottom left',
                                                  icon: 'mdi-airplane',
                                                  bordered: false,
                                                  offsetY: 10,
                                              }
                                            : undefined
                                    "
                                >
                                </v-avatar>
                                <div class="ms-2 my-auto">
                                    {{ q.player_name }}
                                    <template
                                        v-for="replacement in q.replacements"
                                        :key="replacement.fantasy_player_id"
                                    >
                                        <br />
                                        <small>{{
                                            replacement.player_name
                                        }}</small>
                                    </template>
                                    <div class="d-sm-none text-primary">
                                        {{ q.ipl_team }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span v-if="q.counted">
                                {{ q.points }}
                                <v-badge
                                    v-if="q.rank === 1"
                                    color="success"
                                    inline
                                    icon="mdi-medal"
                                />
                            </span>
                            <span v-else class="text-error">
                                {{ q.points }}
                                <v-badge dot color="error" inline />
                            </span>

                            <small
                                v-if="q.recent_points > 0"
                                class="text-success"
                            >
                                (+{{ q.recent_points }})
                            </small>
                            <small
                                v-else-if="q.recent_points < 0"
                                class="text-error"
                            >
                                (-{{ q.recent_points }})
                            </small>

                            <template
                                v-for="replacement in q.replacements"
                                :key="replacement.fantasy_player_id"
                            >
                                <br />
                                <small>{{ replacement.points }}</small>
                            </template>
                            <small class="d-sm-none text-secondary">
                                <br />
                                {{ getPriceString(q, "Currency") }}
                            </small>
                        </td>
                        <td class="d-none d-sm-table-cell">
                            {{ getPriceString(q, "NumberOnly") }}
                        </td>
                        <td class="d-none d-sm-table-cell">
                            {{ q.ipl_team }}
                        </td>
                    </tr>
                    <tr class="text-primary">
                        <td></td>
                        <td>TOTAL</td>
                        <td class="text-title-medium" colspan="3">
                            {{ team.points }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import type { SignedPlayer, Team } from "@/api/fantasy-league";
    import { getPlayerImageUrl } from "@/logic/fantasy-player";
    import { onMounted } from "vue";

    const props = defineProps<{
        team: Team;
        setCanClick: (team: Team) => void;
    }>();

    const team = props.team;

    onMounted(() => {
        props.setCanClick(team);
    });

    function getPriceString(
        player: SignedPlayer,
        view: "NumberOnly" | "Currency",
    ): string {
        if (player.type === "Retention") {
            return "—";
        }

        if (view === "Currency") {
            return `₹${player.price}cr ${getPriceIndicator(player.price_rank)}`;
        } else return `${player.price} ${getPriceIndicator(player.price_rank)}`;
    }

    function getPriceIndicator(price_rank: number): string {
        if (price_rank === 1) return "💰";
        return "";
    }
</script>
