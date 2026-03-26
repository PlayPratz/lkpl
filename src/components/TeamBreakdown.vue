<template>
    <v-container :id="team.team_owner" class="fl-container">
        <v-card border="primary sm opacity-100">
            <div class="py-2 text-center bg-primary">
                {{ team.team_owner.toUpperCase() }}
            </div>
            <v-table hover density="comfortable">
                <thead>
                    <tr class="text-primary">
                        <th width="5%" class="px-0">
                            <v-btn
                                variant="text"
                                density="compact"
                                class="px-0"
                                :append-icon="getSortIcon('slot')"
                                text="#"
                                @click="() => onSortBy('slot')"
                            />
                        </th>
                        <th width="100%" style="padding-left: 48px">
                            <v-btn
                                variant="text"
                                density="compact"
                                :append-icon="getSortIcon('playername')"
                                min-width="0"
                                @click="() => onSortBy('playername')"
                                >Player</v-btn
                            >
                        </th>
                        <th class="px-2">
                            <v-btn
                                variant="text"
                                density="compact"
                                class="fl-player-table-header"
                                :append-icon="getSortIcon('points')"
                                @click="() => onSortBy('points')"
                                >Points</v-btn
                            >
                        </th>
                        <th class="d-none d-sm-table-cell px-2">
                            <v-btn
                                variant="text"
                                density="compact"
                                class="fl-player-table-header"
                                :append-icon="getSortIcon('price')"
                                @click="() => onSortBy('price')"
                                >Price (₹cr)</v-btn
                            >
                        </th>
                        <th class="d-none d-sm-table-cell px-2">
                            <v-btn
                                variant="text"
                                density="compact"
                                class="fl-player-table-header"
                                :append-icon="getSortIcon('iplTeam')"
                                @click="() => onSortBy('iplTeam')"
                                >IPL Team</v-btn
                            >
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="q in team.players.slice().sort(sortPlayers)"
                        :key="q.fantasy_player_id"
                    >
                        <td class="fl-player-table-item text-right">
                            <v-badge
                                v-if="q.type === 'Retention'"
                                inline
                                icon="mdi-repeat"
                                color="warning"
                            />
                            <!-- <v-badge
                                v-else-if="q.type === 'Auction'"
                                inline
                                icon="mdi-gavel"
                                color="secondary"
                            /> -->
                            {{ q.slot_number }}
                        </td>
                        <td class="fl-player-table-item">
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
                                />

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
                            <v-badge
                                v-if="
                                    q.type === 'Auction' && q.price_rank === 1
                                "
                                color="secondary"
                                inline
                                icon="mdi-currency-rupee"
                            />
                        </td>
                        <td class="d-none d-sm-table-cell">
                            {{ q.ipl_team }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="pa-0 h-0">
                            <v-divider
                                thickness="1"
                                color="primary"
                                opacity="1"
                            />
                        </td>
                    </tr>

                    <tr class="text-primary">
                        <td class="text-right">{{ team.rank }}</td>
                        <td>TOTAL</td>
                        <td class="text-title-medium">
                            {{ team.points }}
                            <span
                                class="d-sm-none text-body-small text-secondary"
                                ><br />
                                ₹{{ team.purse_spent }}cr
                            </span>
                        </td>
                        <td class="d-none d-sm-table-cell">
                            ₹{{ team.purse_spent }}cr
                        </td>
                        <td class="d-none d-sm-table-cell" />
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import type { SignedPlayer, Team } from "@/api/fantasy-league";
    import { getPlayerImageUrl } from "@/api/fantasy-ipl";
    import { onMounted } from "vue";

    const props = defineProps<{
        team: Team;
        commenced: number;
        setCanClick: (team: Team) => void;
        sort: SortSettings;
        onSortBy: (parameter: SortParameter) => void;
    }>();

    type SortParameter = "slot" | "playername" | "points" | "price" | "iplTeam";
    type SortSettings = {
        parameter: SortParameter;
        direction: number;
    };

    onMounted(() => {
        props.setCanClick(props.team);
    });

    function getPriceString(
        player: SignedPlayer,
        view: "NumberOnly" | "Currency",
    ): string {
        if (view === "Currency") {
            return `₹${player.price}cr`;
        } else return `${player.price}`;
    }

    function getSortIcon(parameter: SortParameter): string {
        if (props.sort.parameter === parameter) {
            if (props.sort.direction > 0) return "mdi-arrow-up";
            else return "mdi-arrow-down";
        }
        return "mdi-circle-small";
    }

    function sortPlayers(a: SignedPlayer, b: SignedPlayer): number {
        let sortValue;
        switch (props.sort.parameter) {
            case "slot":
                sortValue = a.slot_number - b.slot_number;
                break;
            case "playername":
                sortValue = a.player_name.localeCompare(b.player_name);
                break;
            case "points":
                sortValue = a.points - b.points;
                break;
            case "price":
                sortValue = a.price - b.price;
                break;
            case "iplTeam":
                sortValue = a.ipl_team.localeCompare(b.ipl_team);
                break;
        }
        // Tie-breaker
        if (sortValue === 0) {
            sortValue = a.slot_number - b.slot_number;
        }
        return sortValue * props.sort.direction;
    }
</script>
