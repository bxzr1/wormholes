import { NodeType, PlanetTypes, isUnreachable } from "./template";

export class HexNode {

    private id: number;
    private nodeType: NodeType;
    private neighbors: HexNode [] = [];
    private isPlanet: boolean;
    private planetName: PlanetTypes | undefined;
    private _hexNodeCenterX: number | null = null;
    private _hexNodeCenterY: number | null = null;

    constructor(id: number, nodeType: NodeType, planetName?: PlanetTypes) {
        this.id = id;
        this.nodeType = nodeType;
        
        this.isPlanet = nodeType === NodeType.planet;
        this.planetName = planetName;
    }

    public set hexNodeCenterX(x: number | null) {
        this._hexNodeCenterX = x;
    }

    public get hexNodeCenterX(): number | null {
        return this._hexNodeCenterX;
    }
    
    public set hexNodeCenterY(y: number | null) {
        this._hexNodeCenterY = y;
    }

    public get hexNodeCenterY(): number | null {
        return this._hexNodeCenterY;
    }

    public setNeighbors(neighbors: HexNode []) {
        this.neighbors = neighbors;
    }

    public addNeighbor(neighbor: HexNode): void {
        if (this.neighbors.includes(neighbor) || isUnreachable(neighbor.nodeType) || isUnreachable(this.nodeType))
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