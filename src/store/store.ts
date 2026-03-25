import { type Season } from "@/api/fantasy-league";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MEMORY_STORE: Record<string, any> = {};

export function saveSeasons(seasons: Season[]) {
    MEMORY_STORE["seasons"] = seasons;
}

export function loadSeasons(): Season[] | null {
    return MEMORY_STORE["seasons"] ?? null;
}
