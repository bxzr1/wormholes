import { BoardPiece } from "./BoardPiece";
import { HexNode } from "./HexNode";
import { NodeType, template } from "./template";

interface BoardPieceConnection {
    neighborPieceIndex: number;
    neighborEdgeIndex: number;
    thisEdgeIndex: number;
}

interface BoardPieceData {
    templateIndex: number,
    rotation: number
}

const boardPieceNeighborsMap: { [key: number]: BoardPieceConnection[] } = {
    // Connection object for each of these
    0: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ], 
    1: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 0, thisEdgeIndex: 3 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ],
    2: [
        { neighborPieceIndex: 1, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 0, thisEdgeIndex: 3 }
    ],
    3: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 1, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 2, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 0, thisEdgeIndex: 3 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 5, thisEdgeIndex: 2 }
    ],
    4: [
        { neighborPieceIndex: 0, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 3, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 0, thisEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 5, thisEdgeIndex: 2 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 4, thisEdgeIndex: 1 },
    ],
    5: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 3, thisEdgeIndex: 0 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 4, thisEdgeIndex: 1 }
    ],
    6: [
        { neighborPieceIndex: 4, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 5, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 7, neighborEdgeIndex: 3, thisEdgeIndex: 0 }
    ],
    7: [
        { neighborPieceIndex: 3, neighborEdgeIndex: 2, thisEdgeIndex: 5 },
        { neighborPieceIndex: 4, neighborEdgeIndex: 1, thisEdgeIndex: 4 },
        { neighborPieceIndex: 6, neighborEdgeIndex: 0, thisEdgeIndex: 3 }
    ]
};

const edgeLookupIndices: { [key: number]: number[] } = {
    0: [2, 1],
    1: [1, 0],
    2: [0],
};

export class GameBoard {
    public boardPieces: BoardPiece[] = [];

    // constructor() {
    // }

    toJson = (): string => {
        const resultArray: BoardPieceData[]= [];
        for (let i = 0; i < this.boardPieces.length; i++) {
            resultArray.push({ templateIndex: this.boardPieces[i].getTemplateIndex(),
                rotation: this.boardPieces[i].getRotation() })
        }

        return JSON.stringify(resultArray);
    }

    generateGameBoard = (numberOfPieces: number) => {
        let templateIndex = 0;
        let templateIndices = this.randomizeArray();
        
        while (this.boardPieces.length < numberOfPieces) {  
            const placementIndex = this.boardPieces.length;
            this.addBoardPiece(new BoardPiece(placementIndex, templateIndex, template[templateIndices[templateIndex]], Math.floor(Math.random() * 5)), placementIndex);
            templateIndex += 1;
            
            if (templateIndex >= templateIndices.length) {
                templateIndices = this.randomizeArray();
                templateIndex = 0;
                this.boardPieces = [];
            }
        }

        sessionStorage.setItem("gameBoard", this.toJson());
    }

    loadGameBoard = (data: BoardPieceData[]) => {
        for (let i = 0; i < data.length; i++) {
            this.addBoardPiece(new BoardPiece(i, data[i].templateIndex, template[data[i].templateIndex], data[i].rotation), i);
        }
    }

    private randomizeArray() {
        const templateIndices = Array.from(Array(template.length).keys());

        for (let i = template.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1)) + 1;
            const temp = templateIndices[i];
            templateIndices[i] = templateIndices[randomIndex];
            templateIndices[randomIndex] = temp;
        }
        return templateIndices;
    }

    public addBoardPiece(boardPiece: BoardPiece, index: number) {
        let numRotations = 0;
        let isValid = this.validateBoardPiece(boardPiece, index);
        while (!isValid && numRotations < 6) {
            boardPiece.rotate();
            numRotations += 1;
            isValid = this.validateBoardPiece(boardPiece, index);
        }
        if (numRotations >= 6) {
            return;
        }
        this.linkBoardPiece(boardPiece, index);
        this.boardPieces[index] = boardPiece;
    }

    private linkBoardPiece(boardPiece: BoardPiece, index: number) {
        const boardPieceConnections = boardPieceNeighborsMap[index];
        for (const boardPieceConnection of boardPieceConnections) {
            const neighborPiece = this.boardPieces[boardPieceConnection.neighborPieceIndex];
            if (!neighborPiece) {
                continue;
            }
            const neighborEdge = neighborPiece.edgeAtIndex(boardPieceConnection.neighborEdgeIndex);
            const thisEdge = boardPiece.edgeAtIndex(boardPieceConnection.thisEdgeIndex);

            //not checking type - unreachable
            thisEdge[0].addNeighbors([neighborEdge[2], neighborEdge[1]]);
            thisEdge[1].addNeighbors([neighborEdge[1], neighborEdge[0]]);
            thisEdge[2].addNeighbors([neighborEdge[0]]);
        }
    }

    private validateBoardPiece(boardPiece: BoardPiece, index: number) {
        const boardPieceConnections = boardPieceNeighborsMap[index];
        for (const boardPieceConnection of boardPieceConnections) {
            const neighborPiece = this.boardPieces[boardPieceConnection.neighborPieceIndex];
            if (!neighborPiece) {
                continue;
            }
            const neighborEdge = neighborPiece.edgeAtIndex(boardPieceConnection.neighborEdgeIndex);
            const thisEdge = boardPiece.edgeAtIndex(boardPieceConnection.thisEdgeIndex);

            if (!this.validateEdge(thisEdge, neighborEdge)) {
                return false;
            }
            
            if (!this.validateEdge(neighborEdge, thisEdge)) {
                return false;
            }
        }

        return true;
    }

    private validateEdge(edge: HexNode[], neighborEdge: HexNode[]): boolean {
        const edgePlanetIndices = edge.map((edgeNode, index) => {
            if (edgeNode.getNodeType() === NodeType.planet) {
                return index;
            }

            return undefined;
        });

        for (const edgePlanetIndex of edgePlanetIndices) {
            if (edgePlanetIndex === undefined) {
                continue;
            }
            
            if (!this.validateIfNearPlanet(edgeLookupIndices[edgePlanetIndex].map(index => neighborEdge[index]))) {
                return false;
            }
        }

        return true;
    }

    private validateIfNearPlanet(edges: HexNode[]): boolean {
        for (const edge of edges) {
            if (edge.getNodeType() === NodeType.planet) {
                return false;
            }

            if (edge.getNeighbors().find(neighbor => neighbor.getNodeType() === NodeType.planet)) {
                return false;
            }
        }

        return true;
    }
}
