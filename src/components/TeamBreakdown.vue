<template>
    <v-container :id="teamPoint.name.toLowerCase()">
        <v-card border="primary sm opacity-100">
            <div class="py-2 text-center bg-primary">{{ teamPoint.name }}</div>
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
                    <tr v-for="q in players" :key="q.player.Id">
                        <td>
                            {{ q.index }}
                            <v-badge
                                v-if="q.isRetained"
                                inline
                                icon="mdi-repeat"
                                color="warning"
                            />
                        </td>
                        <td>
                            <div class="d-flex align-items-center my-1">
                                <v-avatar
                                    style="width: 48px; height: 48px"
                                    :image="getPlayerImageUrl(q.player.Id)"
                                    border="primary sm opacity-25"
                                    :badge="
                                        q.player.IS_FP === '1'
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
                                    {{ q.player.Name }}
                                    <template
                                        v-for="replacement in q.replacements"
                                        :key="replacement"
                                    >
                                        <br />
                                        <small>{{
                                            fantasyPlayers[replacement].Name
                                        }}</small>
                                    </template>
                                    <div class="d-sm-none text-primary">
                                        {{ q.player.TeamShortName }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span v-if="topElevenIds.includes(q.player.Id)">
                                {{ q.points }}
                                <v-badge
                                    v-if="q.points === highest"
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
                                v-if="q.player.GamedayPoints !== 0"
                                :class="getGrowthClass(q.player.GamedayPoints)"
                            >
                                ({{ getGrowthSign(q.player.GamedayPoints)
                                }}{{ q.player.GamedayPoints }})
                            </small>
                            <template
                                v-for="replacement in q.replacements"
                                :key="replacement"
                            >
                                <br />
                                <small>{{
                                    fantasyPlayers[replacement].OverallPoints
                                }}</small>
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
                            {{ q.player.TeamShortName }}
                        </td>
                    </tr>
                    <tr class="text-primary">
                        <td></td>
                        <td>TOTAL</td>
                        <td class="text-title-medium" colspan="3">
                            {{ teamPoint.points }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import {
        getPlayerImageUrl,
        type FantasyPlayerObject,
        type FantasyPlayers,
    } from "@/logic/fantasy-player";
    import {
        calculatePointsForPlayer,
        type TeamWithPoints,
    } from "@/logic/teams";
    import { getGrowthClass, getGrowthSign } from "@/styles/styles";
    import { onMounted } from "vue";

    const p = defineProps<{
        // For some reason I am unable to pass two props
        // Seems like a bug, but can't find anything online
        // Hence I have resorted to one prop with two properties
        props: {
            fantasyPlayers: FantasyPlayers;
            teamPoint: TeamWithPoints;
            replacements: Record<number, number>;
            setCanClick: (teamPoint: TeamWithPoints) => void;
        };
    }>();

    const fantasyPlayers = p.props.fantasyPlayers;
    const teamPoint = p.props.teamPoint;

    interface PlayerInTeamBreakdown {
        index: number;
        player: FantasyPlayerObject;
        isRetained: boolean;
        points: number;
        price: number;
        replacements: number[];
    }

    const players: PlayerInTeamBreakdown[] = teamPoint.retentions
        ? teamPoint.retentions.map((retentionItem, index) => ({
              index: index + 1,
              player: fantasyPlayers[retentionItem.playerId],
              isRetained: true,
              points: calculatePointsForPlayer(
                  retentionItem.playerId,
                  fantasyPlayers,
                  p.props.replacements,
              ),
              price: 0,
              replacements: getReplacements(retentionItem.playerId),
          }))
        : [];

    players.push(
        ...teamPoint.auction.map((auctionItem, index) => ({
            index: index + 1,
            player: fantasyPlayers[auctionItem.playerId],
            isRetained: false,
            points: calculatePointsForPlayer(
                auctionItem.playerId,
                fantasyPlayers,
                p.props.replacements,
            ),
            price: auctionItem.price,
            replacements: getReplacements(auctionItem.playerId),
        })),
    );

    const descending = players.slice().sort((a, b) => b.points - a.points);

    const topElevenIds = descending.slice(0, 11).map((p) => p.player.Id);
    const highest = descending.length > 0 ? descending[0].points : 0;

    const mostExpensive =
        teamPoint.auction.length > 0
            ? teamPoint.auction
                  .map((a) => a.price)
                  .reduce((p, c) => (p > c ? p : c))
            : 0.5;

    function getPriceString(
        player: PlayerInTeamBreakdown,
        view: "NumberOnly" | "Currency",
    ): string {
        if (player.isRetained) {
            return "—";
        }

        if (view === "Currency") {
            return `₹${player.price}cr ${getPriceIndicator(player.price)}`;
        } else return `${player.price} ${getPriceIndicator(player.price)}`;
    }

    function getPriceIndicator(price: number): string {
        if (price === mostExpensive) return "💰";
        return "";
    }

    function getReplacements(playerId: number): number[] {
        const replacements: number[] = [];

        let rep = p.props.replacements[playerId];
        while (rep) {
            replacements.push(rep);
            rep = p.props.replacements[rep];
        }

        if (replacements.length > 0) {
            replacements.unshift(playerId); // Add to start
        }

        return replacements;
    }

    onMounted(() => {
        p.props.setCanClick(teamPoint);
    });
</script>
