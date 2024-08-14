import { useDispatch, useSelector } from "react-redux"
import { playerActions, selectCurrentPlayer } from "../reducers/PlayerReducer"
import styles from './PassengerDeck.module.scss'

export function PassengerDeck()
{
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentPassengers = currentPlayer?.passengers || [];
    const dispatch = useDispatch();
    const onClick = ( numPassengers: number ) => {
        dispatch( playerActions.pickupPassengers( numPassengers ))
    } 
    return (
        <div className={ styles.PickupPassengers }>
            PICKUP PASSENGERS:
            <button 
                disabled={ currentPassengers.length > 3 } 
                className={ styles.PickupButton }
                onClick={ () => onClick( 1 ) }
            >
                    1
            </button>
            <button 
                disabled={ currentPassengers.length > 2 } 
                className={ styles.PickupButton }
                onClick={ () => onClick( 2 ) }
            >
                    2
            </button>
            <button 
                disabled={ currentPassengers.length > 1 } 
                className={ styles.PickupButton }
                onClick={ () => onClick( 3 ) }
            >
                    3
            </button>
            <button 
                disabled={ currentPassengers.length > 0 } 
                className={ styles.PickupButton }
                onClick={ () => onClick( 4 ) }
            >
                    4
            </button>
        </div>
    )
}