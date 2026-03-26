import { loadSeasons, saveSeasons } from "@/store/store";

const SERVER_URL = "http://103.113.142.141:8000/api/method";
const API_SEASON_LIST = `${SERVER_URL}/fantasy_league.api.fantasy_season_list`;
const API_SEASON = `${SERVER_URL}/fantasy_league.api.fantasy_season`;

export interface Season {
    name: string;
    league_name: string;
    season_year: number;
    squad_size: number;
    overseas_limit: number;
    best_of: number;
    commenced: number;
}

export interface Team {
    team: string;
    team_owner: string;
    points: number;
    previous_points: number;
    recent_points: number;
    rank: number;
    previous_rank: number;
    recent_rank_gain: number;
    players_retained: number;
    players_bought: number;
    slots_remaining: number;
    overseas_players: number;
    purse_total: number;
    purse_spent: number;
    purse_remaining: number;
    players: SignedPlayer[];
}

export interface Player {
    fantasy_player_id: number;
    player_name: string;
    ipl_team: string;
    overseas: number;
    points: number;
    previous_points: number;
    rank: number;
    previous_rank: number;
    recent_points: number;
}

export interface SignedPlayer extends Player {
    slot_number: number;
    type: "Auction" | "Retention";
    replacements: Player[];
    price: number;
    price_rank: number;
    counted: number;
}

export interface SeasonOverview extends Season {
    teams: Team[];
}

export async function getSeasonList(): Promise<Season[]> {
    if (loadSeasons()) {
        return loadSeasons()!;
    }
    const seasons: Season[] = await handleFrappeJsonResponse(API_SEASON_LIST);
    saveSeasons(seasons);

    return seasons;
}

export async function getSeasonOverview(
    season: string,
): Promise<SeasonOverview> {
    const seasonOverview: SeasonOverview = await handleFrappeJsonResponse(
        API_SEASON + "?season=" + season,
    );
    return seasonOverview;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleFrappeJsonResponse(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    const json = await response.json();
    console.log(json);
    return json["message"];
}
