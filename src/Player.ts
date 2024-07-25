import { HexLocation_t } from "./gameboard/HexNode";

export interface Player_t {
    name: string,
    score: number,
    hexLocation: HexLocation_t | null;
}

// export class Player {
//     private name: string;
//     private score: number;
//     private hex: HexNode | null;

//     constructor(name: string) {
//         this.name = name;
//         this.score = 0;
//         this.hex = null;
//     }

//     public setHex(hex: HexNode): void {
//         this.hex = hex;
//     }

//     public getHex(): HexNode | null {
//         return this.hex;
//     }

//     public getName(): string {
//         return this.name;
//     }

//     public getScore(): number {
//         return this.score;
//     }

//     public increaseScore(points: number): void {
//         this.score += points;
//     }
// }
