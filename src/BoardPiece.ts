import { HexNode } from "./HexNode";
import { NodeType, NodeDescription} from "./template";

const neighborsMap: { [index: number]: number[] } = {
    0: [1,3,4],
    1: [0,2,4,5],
    2: [1,5,6],
    3: [0,4,7,8],
    4: [0,1,3,5,8,9],
    5: [1,2,4,6,9,10],
    6: [2,5,10,11],
    7: [3,8,12],
    8: [3,4,7,9,12,13],
    9: [4,5,8,10,13,14],
    10: [5,6,9,11,14,15],
    11: [6,10,15],
    12: [7,8,13,16],
    13: [8,9,12,14,16,17],
    14: [9,10,13,15,17,18],
    15: [10,11,14,18],
    16: [12,13,17],
    17: [13,14,16,18],
    18: [14,15,17]
};

const edgesMap: { [index: number]: number[] } = {
    0: [0, 1, 2],
    1: [2, 6, 11],
    2: [11, 15, 18],
    3: [18, 17, 16],
    4: [16, 12, 7],
    5: [7, 3, 0],
}

export class BoardPiece{
    private id: number;
    private nodes: HexNode [] = [];
    private _rotation: number;

    constructor(id: number, nodes: NodeDescription[]) {
        this.id = id;
        this._rotation = 0;
        this.nodes = nodes.map((nodeDescription, index) => {
            return new HexNode(index, nodeDescription.type, nodeDescription.name);
        })
        this.setNeighbors();
    }
    
    public get rotation(): number {
        return this._rotation;
    }
    
    public edgeAtIndex(requestedEdgeIndex: number): HexNode[] {
        const actualEdgeIndex = (requestedEdgeIndex + this._rotation) % 6;
        return edgesMap[actualEdgeIndex].map((index) => this.nodes[index]);
    }
    
    public getId() { return this.id;}
    
    public getNodes(){ return this.nodes;}
    
    public rotate(): void {
        if (this._rotation > 5) {
            throw new Error("Something went wrong - invalid rotation reached");
        }
        this._rotation += 1;
    }

    private setNeighbors(){ 
        this.nodes.forEach((node, index) =>{
            const neighborIndicies = neighborsMap[index];
            const mappedIndicies = neighborIndicies.map((neighborIndex) => {
                return this.nodes[neighborIndex]
            });

            const reachableNeighbors = mappedIndicies.filter((hexNode) => {
                return hexNode.getNodeType() !== NodeType.unreachable;
            });

            node.setNeighbors(reachableNeighbors);
    })};

}
