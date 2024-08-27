import { useRef, useState } from 'react'
import { HexNode_t, GenerateNodeBackground, FindNodeGridPosition } from '../utils/hexnodeutils';
import styles from './HexNodeStyles.module.scss'
import classnames from 'classnames'
import { debugHexNodeInfo } from '../utils/debugutils';
import { BoardPieceIndex_t, GridNodeIndex_t, PlayerIndex_t } from '../utils/aliasutils';
import { playerActions, selectCurrentPlayer, selectPlayersAtLocation, selectWormholesAtLocation } from '../reducers/PlayerReducer';
import { useDispatch, useSelector } from 'react-redux';
import { ETooltipPosition, useTooltip } from '../utils/Tooltip';
import { leftclick, rightclick } from '../image_assets/images';


export function HexPiece( props: {
    boardPieceIndex: BoardPieceIndex_t,
    boardPieceRotation: number,
    node: HexNode_t,
    gridID: GridNodeIndex_t, 
    fuelCost?: number,
    adjacentToSelected?: boolean,
}) {
    const { boardPieceIndex, boardPieceRotation, gridID, node, fuelCost, adjacentToSelected } = props;

    const dispatch = useDispatch();

    const nodeRef = useRef<HTMLDivElement >( null );

    const nodeID = node.hexNodeIndex;
    const location = { boardPieceIndex, hexNodeIndex: node.hexNodeIndex };

    const currentPlayer = useSelector( selectCurrentPlayer );
    const bHasWormholesLeft = currentPlayer ? currentPlayer.wormholes[ currentPlayer.wormholes.length - 1 ].locationB === null : false; 
    const currentPlayerOrigin = currentPlayer?.hexLocation;
    const isCurrentOrigin = currentPlayerOrigin?.boardPieceIndex === boardPieceIndex && currentPlayerOrigin.hexNodeIndex === nodeID;

    const wormholesOnNode = useSelector( selectWormholesAtLocation( location ));
    const wormholeOnNode = wormholesOnNode.length > 0 ? wormholesOnNode[0] : undefined;
    const canPlaceWormhole = wormholeOnNode === undefined && bHasWormholesLeft && ( !!adjacentToSelected || isCurrentOrigin );
    const canTraverse = !isCurrentOrigin && fuelCost !== undefined;

    const { row, column } = FindNodeGridPosition(gridID);

    const className = classnames( 
        styles.Hex,
        fuelCost !== undefined && styles[`Fuel_${fuelCost}`],
        canPlaceWormhole && styles.CanPlaceWormhole,
        isCurrentOrigin && styles.isOrigin,
        wormholeOnNode !== undefined && styles.Wormhole,
        wormholeOnNode !== undefined && styles[`Player${ wormholeOnNode.playerIndex }`],
        wormholeOnNode !== undefined && styles[`${ wormholeOnNode.active ? 'Active' : 'Inactive'}`],
        styles[node.nodeType ],
        debugHexNodeInfo && styles.DebugMode
    )
    const tooltip = useTooltip( 
        <HexTooltipContent isCurrentOrigin={ isCurrentOrigin } fuelCost={ fuelCost } canPlaceWormhole={ canPlaceWormhole } />,
         nodeRef, 
         ETooltipPosition.right 
    )

    const fnShowTooltip = () => {
        if( canPlaceWormhole || canTraverse )
            tooltip.setIsVisible( true );
    }
    const fnHideTooltip = () => {
        tooltip.setIsVisible( false );
    }

    const fnMoveOnClick = () => {
        if( !currentPlayer || fuelCost === undefined)
            return;
        dispatch( playerActions.movePlayer( { playerIndex: currentPlayer.playerIndex, hex: location, fuelCost: fuelCost }))
    }

    const fnPlaceWormhole = ( ev: React.MouseEvent ) => {
        if( !currentPlayer)
            return;
        ev.preventDefault();
        dispatch( playerActions.placeWormhole( { playerIndex: currentPlayer.playerIndex, hex: location } ));
    }

    return (
        <div 
            className={className}
            ref={ nodeRef }
            style={ { gridRowStart: row, gridColumnStart: column, gridRowEnd: 'span 4', gridColumnEnd: 'span 2' } }
            onMouseEnter={ fnShowTooltip }
            onMouseLeave={ fnHideTooltip }
            onClick={ fnMoveOnClick }
            onContextMenu={ fnPlaceWormhole }
        >
            { tooltip.tooltipContent }
           <HexContent node={ node } boardPieceIndex={ boardPieceIndex } boardPieceRotation={ boardPieceRotation } currentPlayerIndex={ currentPlayer?.playerIndex }/>
        </div>
    ) 
}

function HexTooltipContent( props: { fuelCost? : number, canPlaceWormhole: boolean, isCurrentOrigin: boolean })
{
    const { isCurrentOrigin, fuelCost, canPlaceWormhole } = props;
    const bShowFuel = !isCurrentOrigin && fuelCost !== undefined;
    if( !bShowFuel && !canPlaceWormhole)
        return null;

    return (
        <div className={ styles.TooltipContent }>
            { bShowFuel && 
                <div className={ styles.FuelInfo }>
                    <img src={ leftclick } alt={ '' }/>
                    { `MOVE (${ fuelCost } FUEL)`}
                </div>
            }
           { canPlaceWormhole &&
                <div className={ styles.WormholeInfo }>
                    <img src={ rightclick }  alt={ '' }/>
                    { `PLACE NEXT WORMHOLE`}
                </div>
           }
        </div>
    )
}

function HexContent( props: { node: HexNode_t, boardPieceIndex: BoardPieceIndex_t, boardPieceRotation: number, currentPlayerIndex?: PlayerIndex_t }) 
{
    const { node, boardPieceIndex, boardPieceRotation, currentPlayerIndex } = props;
    const nodeID = node.hexNodeIndex;
    const location = { boardPieceIndex, hexNodeIndex: node.hexNodeIndex };
    const playersOnNode = useSelector( selectPlayersAtLocation( location ))

    const [ imgUrl ] = useState<string>( () => GenerateNodeBackground(node.nodeType, node.planetName ));  
    return (
        <>
            <HexDebugInfo boardPieceIndex={ boardPieceIndex } nodeID={ nodeID } planetName={ node.planetName || "" } boardPieceRotation={ boardPieceRotation }/>
            { 
                playersOnNode.length > 0 && 
                    <div className={ styles.Players } >
                    {
                        playersOnNode.map( ( player ) => {
                            const isCurrentPlayer = currentPlayerIndex !== undefined ? currentPlayerIndex === player.playerIndex : false;
                            return (
                                <div className={ classnames( styles.PlayerToken, styles[ isCurrentPlayer ? 'CurrentPlayer' : "" ], styles[`Player${ player.playerIndex }`]) }></div>
                            )
                        })
                    }
                </div>
            }
            <img className={ styles.HexBackground } src={ imgUrl } alt=''></img>
        </>
    )
}

function HexDebugInfo( props: { boardPieceIndex: number, nodeID: number, planetName: string, boardPieceRotation: number })
{
    const { boardPieceIndex, nodeID, planetName, boardPieceRotation } = props; 
    return (
        <div className={ styles.HexInfo } >
            { debugHexNodeInfo && 
                <>
                    <div> {`${boardPieceIndex}_${nodeID}`} </div>
                    <div>{ planetName }</div>
                    <div className={ styles.Edge0 }>{( 0 + boardPieceRotation )%6 }</div>
                    <div className={ styles.Edge1 }>{( 1 + boardPieceRotation )%6 }</div>
                    <div className={ styles.Edge2 }>{( 2 + boardPieceRotation )%6 }</div>
                    <div className={ styles.Edge3 }>{( 3 + boardPieceRotation )%6 }</div>
                    <div className={ styles.Edge4 }>{( 4 + boardPieceRotation )%6 }</div>
                    <div className={ styles.Edge5 }>{( 5 + boardPieceRotation )%6 }</div>
                </> 
            }
        </div>
    )
}