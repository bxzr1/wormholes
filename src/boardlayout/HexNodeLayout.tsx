import { useState, useRef, useLayoutEffect } from 'react'
import { HexNode_t, HexLocation_t, GenerateNodeBackground, FindNodeGridPosition } from '../utils/hexnodeutils';
import { isUnreachable } from '../template';
import styles from './HexNodeStyles.module.scss'
import classnames from 'classnames'
import { BoardPieceIndex_t } from '../utils/boardpieceutils';
import { debugHexNodeInfo } from '../utils/debugutils';

export function HexPiece( props: {
    boardPieceIndex: BoardPieceIndex_t,
    boardPieceRotation: number,
    node: HexNode_t,
    gridID: number,
    isSelected: boolean, 
    isNeighbor: boolean,
    setSelectedLocation: ( hexLocation: HexLocation_t )=> void 
}) {
    const { boardPieceIndex, boardPieceRotation, gridID, node, isSelected, isNeighbor, setSelectedLocation } = props;
    const [ imgUrl ] = useState<string>( () => GenerateNodeBackground(node.nodeType, node.planetName ));  
    const nodeID = node.hexNodeIndex;
    const { row, column } = FindNodeGridPosition(gridID);
    const className = classnames( 
        styles.Hex,
        isSelected && styles.Selected,
        isNeighbor && styles.IsNeighbor,
        styles[node.nodeType ],
        debugHexNodeInfo && styles.DebugMode
    )
    const hexNodeDiv = useRef<HTMLDivElement>(null);
    
    useLayoutEffect(() => {
        const boundingRectangle = hexNodeDiv?.current?.getBoundingClientRect();
        if (boundingRectangle === undefined) {
            return;
        }

        // node.hexNodeCenterX = boundingRectangle.x + boundingRectangle.width/2;
        // node.hexNodeCenterY = boundingRectangle.y + boundingRectangle.height/2;
    }, [node]);

    const onClick = () => {
        if( debugHexNodeInfo || !isUnreachable( node.nodeType ) )
        {
            setSelectedLocation( { boardPieceIndex: boardPieceIndex, hexNodeIndex: nodeID } )
        }
    }

    return (
        <div className={className}
            ref={hexNodeDiv}  
            style={ {
                gridRowStart: row,
                gridColumnStart: column,
                gridRowEnd: 'span 4',
                gridColumnEnd: 'span 2'

             } } 
            onClick={onClick}>
            <div className={ styles.HexInfo } >
               {
                    debugHexNodeInfo && 
                    <>
                        <div> {`${boardPieceIndex}_${nodeID}`} </div>
                        <div>{node.planetName}</div>
                        <div className={ styles.Edge0 }>{( 0 + boardPieceRotation )%6 }</div>
                        <div className={ styles.Edge1 }>{( 1 + boardPieceRotation )%6 }</div>
                        <div className={ styles.Edge2 }>{( 2 + boardPieceRotation )%6 }</div>
                        <div className={ styles.Edge3 }>{( 3 + boardPieceRotation )%6 }</div>
                        <div className={ styles.Edge4 }>{( 4 + boardPieceRotation )%6 }</div>
                        <div className={ styles.Edge5 }>{( 5 + boardPieceRotation )%6 }</div>
                    </>
               }
            </div>
            <img className={ styles.HexBackground } src={ imgUrl } alt=''></img>
        </div>
    ) 
}