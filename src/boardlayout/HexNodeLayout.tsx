import { useState } from 'react'
import { HexNode_t, HexLocation_t, GenerateNodeBackground, FindNodeGridPosition } from '../utils/hexnodeutils';
import { isUnreachable } from '../template';
import styles from './HexNodeStyles.module.scss'
import classnames from 'classnames'
import { debugHexNodeInfo } from '../utils/debugutils';
import { BoardPieceIndex_t, GridNodeIndex_t } from '../utils/aliasutils';
import { selectPlayersAtLocation } from '../reducers/PlayerReducer';
import { useSelector } from 'react-redux';

export function HexPiece( props: {
    boardPieceIndex: BoardPieceIndex_t,
    boardPieceRotation: number,
    node: HexNode_t,
    gridID: GridNodeIndex_t,
    isSelected: boolean, 
    isNeighbor: boolean,
}) {
    const { boardPieceIndex, boardPieceRotation, gridID, node, isSelected, isNeighbor } = props;
    const nodeID = node.hexNodeIndex;

    const playersOnNode = useSelector( selectPlayersAtLocation( { boardPieceIndex, hexNodeIndex: node.hexNodeIndex }))

    const [ imgUrl ] = useState<string>( () => GenerateNodeBackground(node.nodeType, node.planetName ));  
    const { row, column } = FindNodeGridPosition(gridID);
    const className = classnames( 
        styles.Hex,
        isSelected && styles.Selected,
        isNeighbor && styles.IsNeighbor,
        styles[node.nodeType ],
        debugHexNodeInfo && styles.DebugMode
    )

    return (
        <div className={className}
            style={ {
                gridRowStart: row,
                gridColumnStart: column,
                gridRowEnd: 'span 4',
                gridColumnEnd: 'span 2'

             } } 
            onClick={() => {} }>
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
            { 
                playersOnNode.length > 0 && 
                    <div className={ styles.Players } >
                    {
                        playersOnNode.map( ( player ) => {
                            return <div className={ classnames( styles.PlayerToken, styles[`Player${ player.playerIndex }`]) }></div>
                        })
                    }
                </div>
            }
            <img className={ styles.HexBackground } src={ imgUrl } alt=''></img>
        </div>
    ) 
}