<template>
    <v-container :id="teamPoint.name.toLowerCase()">
        <v-card class="bg-secondary pt-2">
            <h4 class="text-center">{{ teamPoint.name }}</h4>
            <v-table hover>
                <thead>
                    <tr class="bg-secondary">
                        <th style="width: 10%;">#</th>
                        <th>Player</th>
                        <th style="width: 30%;">Points</th>
                        <th class="d-none d-sm-table-cell" style="width: 10%;">Price (₹cr)</th>
                        <th class="d-none d-sm-table-cell" style="width: 10%;">Team</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in players">
                        <td>{{ p.index }}</td>
                        <td>
                            <div class="d-flex align-items-center my-1">
                                <div class="my-auto border border-primary rounded-circle overflow-hidden"
                                    style="width: 48px; height: 48px;"
                                    :background-image="`url(${getPlayerImageUrl(p.player.Id)})`">
                                    <img class="img-fluid" style="height: 48px; align-self: center;"
                                        :src="getPlayerImageUrl(p.player.Id)" alt="Player Image" />
                                </div>
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
                        <td>{{ getPoints(p) }}
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
                                ₹{{ p.price }}cr{{ getPriceIndicator(p.price) }}
                            </small>
                        </td>
                        <td class="d-none d-sm-table-cell"> {{ p.price ? p.price : '🩹' }} {{
                            getPriceIndicator(p.price) }}
                        </td>
                        <td class="d-none d-sm-table-cell">{{ p.player.TeamShortName }}</td>
                    </tr>
                    <tr class="bg-primary">
                        <td></td>
                        <td><b>TOTAL</b></td>
                        <td><b>{{ teamPoint.points }}</b></td>
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


const p = defineProps<{
    // For some reason I am unable to pass two props
    // Seems like a bug, but can't find anything online
    // Hence I have resorted to one prop with two properties
    props: {
        fantasyPlayers: FantasyPlayers,
        teamPoint: TeamWithPoints,
        replacements: Record<number, number>
    }
}>();

const fantasyPlayers = p.props.fantasyPlayers;
const teamPoint = p.props.teamPoint;

interface PlayerInTeamBreakdown {
    index: number,
    player: FantasyPlayerObject,
    points: number,
    price: number,
    replacements: number[]
}

const players: PlayerInTeamBreakdown[] = teamPoint.auction.map((auctionItem, index) => ({
    index: index + 1,
    player: fantasyPlayers[auctionItem.playerId],
    points: calculatePointsForPlayer(auctionItem.playerId, fantasyPlayers, p.props.replacements),
    price: auctionItem.price,
    replacements: getReplacements(auctionItem.playerId),
}));

// const log = {
//     "team": p.props.teamPoint.name,
//     "playerPoints": players
// }
// console.log(log)

const descending = players.slice().sort((a, b) => b.points - a.points);

const topElevenIds = descending.slice(0, 11).map((p) => p.player.Id);
const highest = descending[0].points;

function getPointIndicator(p: PlayerInTeamBreakdown): string {
    if (p.player.OverallPoints == highest) {
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

const mostExpensive = teamPoint.auction.map((a) => a.price).reduce((p, c) => p > c ? p : c);

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

</script>