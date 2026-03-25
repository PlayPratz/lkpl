import { type Season } from "@/api/fantasy-league";

export function saveSeasons(seasons: Season[]) {
    sessionStorage.setItem("seasons", JSON.stringify(seasons));
}

export function loadSeasons(): Season[] | null {
    const seasons = sessionStorage.getItem("seasons");
    if (seasons) {
        return JSON.parse(seasons);
    }
    return null;
}
