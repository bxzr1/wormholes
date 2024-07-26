import { useState, useRef, useLayoutEffect } from 'react'
import { HexNode_t, HexLocation_t, GenerateNodeBackground, FindNodeGridPosition } from '../utils/hexnodeutils';
import { isUnreachable } from '../template';
import styles from './HexNodeStyles.module.scss'
import classnames from 'classnames'

export function HexPiece( props: {
    boardPieceID: number,
    boardPieceRotation: number,
    node: HexNode_t,
    gridID: number,
    isSelected: boolean, 
    isNeighbor: boolean,
    setSelectedLocation: ( hexLocation: HexLocation_t )=> void 
}) {
    const { boardPieceID, gridID, node, isSelected, isNeighbor, setSelectedLocation } = props;
    const [ imgUrl ] = useState<string>( () => GenerateNodeBackground(node.nodeType, node.planetName ));  
    const nodeID = node.nodeID;
    const { row, column } = FindNodeGridPosition(gridID);
    const className = classnames( 
        styles.Hex,
        isSelected && styles.Selected,
        isNeighbor && styles.IsNeighbor,
        styles[node.nodeType ]
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
        if( !isUnreachable( node.nodeType ) )
        {
            setSelectedLocation( { boardPieceID, hexNodeID: nodeID } )
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
            <p className={ styles.HexInfo } >
                {`id: ${nodeID}`}
                {node.planetName}
            </p>
            <img className={ styles.HexBackground } src={ imgUrl } alt=''></img>
        </div>
    ) 
}