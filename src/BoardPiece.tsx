import React, { useEffect, useState, useMemo } from 'react';
import { HexNode } from './HexNode';

const boardFive = [
    new HexNode(0, false),
    new HexNode(1, false),
    new HexNode(2, true, 'black gold'),
    new HexNode(3, false),
    new HexNode(4, false),
    new HexNode(5, false),
    new HexNode(6, false),
    new HexNode(7, false),
    new HexNode(8, false),
    new HexNode(9, false),
    new HexNode(10, false),
    new HexNode(11, false),
    new HexNode(12, true, 'fuzzy orange'),
    new HexNode(13, false),
    new HexNode(14, false),
    new HexNode(15, false),
]

const assignBoardFiveNeighbors = () => {
    boardFive[0].setNeighbors([boardFive[1], boardFive[2], boardFive[3]]);
    boardFive[1].setNeighbors([boardFive[0], boardFive[3], boardFive[4]]);
    boardFive[2].setNeighbors([boardFive[0], boardFive[3], boardFive[6]]);
    boardFive[3].setNeighbors([boardFive[0], boardFive[1], boardFive[2], boardFive[4], boardFive[7]]);
    boardFive[4].setNeighbors([boardFive[1], boardFive[3], boardFive[5], boardFive[7], boardFive[8], boardFive[9]]);
    boardFive[5].setNeighbors([boardFive[4], boardFive[8], boardFive[9]]);
    boardFive[6].setNeighbors([boardFive[2], boardFive[10]]);
    boardFive[7].setNeighbors([boardFive[3], boardFive[4], boardFive[8], boardFive[11]]);
    boardFive[8].setNeighbors([boardFive[4], boardFive[5], boardFive[7], boardFive[9], boardFive[12]]);
    boardFive[9].setNeighbors([boardFive[5], boardFive[8], boardFive[12]]);
    boardFive[10].setNeighbors([boardFive[6], boardFive[11], boardFive[13]]);
    boardFive[11].setNeighbors([boardFive[7], boardFive[10], boardFive[13], boardFive[14]]);
    boardFive[12].setNeighbors([boardFive[8], boardFive[9], boardFive[15]]);
    boardFive[13].setNeighbors([boardFive[10], boardFive[11], boardFive[14]]);
    boardFive[14].setNeighbors([boardFive[11], boardFive[13], boardFive[15]]);
    boardFive[15].setNeighbors([boardFive[12], boardFive[14]]);
}

export const BoardFive = () => {
    const [ clicked, setClicked ] = useState<number>();
    
    const neighbors = useMemo(() => {
        if (clicked === 0 || clicked) return boardFive[clicked].getNeighbors();
        else return [];
    }, [clicked]);

    useEffect(() => {
        assignBoardFiveNeighbors();
    }, []);


    return (
        <div>
            {boardFive.map(hex => {
                const isClicked = hex.getId() === clicked;
                const isNeighbor = neighbors.includes(boardFive[hex.getId()]);
                return (<div style={{color: 'white', border: '1px solid blue', height: 20, width: 20, margin: 8, padding: 10, backgroundColor: isClicked ? 'blue' : isNeighbor ? 'green' : 'red'}} onClick={() => setClicked(hex.getId())}>
                    {hex.getId()}
                </div>)
            })}
        </div>
    )
}