import { HexLocation_t } from "./hexnodeutils";

export interface Player_t {
    name: string,
    score: number,
    hexLocation: HexLocation_t | null;
}