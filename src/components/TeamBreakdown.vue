<template>
    <v-container :id="teamPoint.name.toLowerCase()">
        <v-card border="primary sm opacity-100">
            <div class="py-2 text-center bg-primary">{{ teamPoint.name }}</div>
            <v-table hover density="compact">
                <thead>
                    <tr class="text-primary">
                        <th style="width: 10%;">#</th>
                        <th>Player</th>
                        <th style="width: 30%;">Points</th>
                        <th class="d-none d-sm-table-cell" style="width: 15%;">Price (₹cr)</th>
                        <th class="d-none d-sm-table-cell" style="width: 10%;">Team</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in players">
                        <td>{{ p.index }}</td>
                        <td>
                            <div class="d-flex align-items-center my-1">
                                <v-avatar style="width: 48px; height: 48px;" :image="getPlayerImageUrl(p.player.Id)"
                                    border="primary sm opacity-25" />
                                <div class="ms-2 my-auto">
                                    {{ p.player.Name }} {{ getOverseasIndicator(p.player) }}
                                    <template v-for="replacement in p.replacements">
                                        <br />
                                        <small>{{ fantasyPlayers[replacement].Name }}</small>
                                    </template>
                                    <div class="d-sm-none text-primary">
                                        {{ p.player.TeamShortName }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            {{ getPoints(p) }}
                            <small v-if="p.player.GamedayPoints !== 0" :class="getGrowthClass(p.player.GamedayPoints)">
                                ({{ getGrowthSign(p.player.GamedayPoints) }}{{ p.player.GamedayPoints }})
                            </small>
                            {{ getPointIndicator(p) }}
                            <template v-for="replacement in p.replacements">
                                <br />
                                <small>{{ fantasyPlayers[replacement].OverallPoints }}</small>
                            </template>
                            <small class="d-sm-none text-secondary">
                                <br />
                                {{ getPriceString(p, "Currency") }}
                            </small>
                        </td>
                        <td class="d-none d-sm-table-cell"> {{ getPriceString(p, "NumberOnly") }}</td>
                        <td class="d-none d-sm-table-cell">{{ p.player.TeamShortName }}</td>
                    </tr>
                    <tr class="text-primary">
                        <td></td>
                        <td>TOTAL</td>
                        <td class="">{{ teamPoint.points }}</td>
                        <td class="d-none d-sm-table-cell"></td>
                        <td class="d-none d-sm-table-cell"></td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>

</template>

<script setup lang="ts">
import { getPlayerImageUrl, type FantasyPlayerObject, type FantasyPlayers } from '@/logic/fantasy-player';
import { calculatePointsForPlayer, type TeamWithPoints } from '@/logic/teams';
import { getGrowthClass, getGrowthSign } from '@/styles/styles';
import { onMounted } from 'vue';

const p = defineProps<{
    // For some reason I am unable to pass two props
    // Seems like a bug, but can't find anything online
    // Hence I have resorted to one prop with two properties
    props: {
        fantasyPlayers: FantasyPlayers,
        teamPoint: TeamWithPoints,
        replacements: Record<number, number>,
        setCanClick: (teamPoint: TeamWithPoints) => void
    }
}>();

const fantasyPlayers = p.props.fantasyPlayers;
const teamPoint = p.props.teamPoint;

interface PlayerInTeamBreakdown {
    index: number,
    player: FantasyPlayerObject,
    isRetained: boolean,
    points: number,
    price: number,
    replacements: number[]
}

const players: PlayerInTeamBreakdown[] = teamPoint.retentions ? teamPoint.retentions.map((retentionItem, index) => ({
    index: index + 1,
    player: fantasyPlayers[retentionItem.playerId],
    isRetained: true,
    points: calculatePointsForPlayer(retentionItem.playerId, fantasyPlayers, p.props.replacements),
    price: 0,
    replacements: getReplacements(retentionItem.playerId),
})) : [];

players.push(...teamPoint.auction.map((auctionItem, index) => ({
    index: index + 1,
    player: fantasyPlayers[auctionItem.playerId],
    isRetained: false,
    points: calculatePointsForPlayer(auctionItem.playerId, fantasyPlayers, p.props.replacements),
    price: auctionItem.price,
    replacements: getReplacements(auctionItem.playerId),
})));

const descending = players.slice().sort((a, b) => b.points - a.points);

const topElevenIds = descending.slice(0, 11).map((p) => p.player.Id)
const highest = descending.length > 0 ? descending[0].points : 0;

function getPointIndicator(p: PlayerInTeamBreakdown): string {
    if (p.player.OverallPoints === highest && highest > 0) {
        return '🥇';
    } else if (!topElevenIds.includes(p.player.Id)) {
        return '❌';
    }

    return '';
}

function getOverseasIndicator(p: FantasyPlayerObject): string {
    if (p.IS_FP === '1') {
        return '✈️';
    }
    return '';
}

const mostExpensive = teamPoint.auction.length > 0 ? teamPoint.auction.map((a) => a.price).reduce((p, c) => p > c ? p : c) : 0.5;

function getPriceString(player: PlayerInTeamBreakdown, view: "NumberOnly" | "Currency"): string {
    if (player.isRetained) {
        return '🔁'
    }

    if (view === "Currency") {
        return `₹${player.price}cr ${getPriceIndicator(player.price)}`;
    } else
        return `${player.price} ${getPriceIndicator(player.price)}`;
}

function getPriceIndicator(price: number): string {
    if (price === mostExpensive) return '💰';
    return '';
}

function getPoints(pitb: PlayerInTeamBreakdown): number {
    return calculatePointsForPlayer(pitb.player.Id, fantasyPlayers, p.props.replacements);
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