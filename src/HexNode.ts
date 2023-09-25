import { NodeType } from "./template";

export class HexNode {

    private id: number;
    private nodeType: NodeType;
    private isPlanet: boolean;
    private neighbors: HexNode [] = [];
    private planetName: string | undefined = undefined;

    constructor(id: number, nodeType: NodeType, planetName?: string) {
        this.id = id;
        this.nodeType = nodeType;
        this.isPlanet = nodeType === NodeType.planet;
        this.planetName = planetName;
    }

    public setNeighbors(neighbors: HexNode []) {
        this.neighbors = neighbors;
    }

    public addNeighbor(neighbor: HexNode): void {
        if (this.neighbors.includes(neighbor) || neighbor.nodeType == NodeType.unreachable || this.nodeType == NodeType.unreachable)
        {
            return;
        }

        this.neighbors.push(neighbor);
        neighbor.addNeighbor(this);
    }

    public addNeighbors(neighbors: HexNode[]): void {
        neighbors.forEach(neighbor => this.addNeighbor(neighbor));
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

    public getNodeType(){
        return this.nodeType;
    }
}