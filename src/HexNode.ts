

export class HexNode {

    private id: number;
    private isPlanet: boolean;
    private neighbors: HexNode [] = [];
    private planetName: string | undefined = undefined;

    constructor(id: number, isPlanet: boolean, planetName?: string) {
        this.id = id;
        this.isPlanet = isPlanet;
        this.planetName = planetName;
    }

    public setNeighbors(neighbors: HexNode []) {
        this.neighbors = neighbors;
    }


    public getId() {
        return this.id;
    }

    public getIsPlanet() {
        return this.isPlanet;
    }

    public getPlanetName() {
        return this.planetName;
    }

    public getNeighbors() {
        return this.neighbors;
    }
    // add neighbors, add (player) worm hole

}


































// const template = [
//     {
//         id: 5,
//         numHexes: 16,
//         neighborMap: {
//             0: 123,
//             ....
//         } 

//     }
// ]