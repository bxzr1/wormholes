import { useSelector } from "react-redux"
import { selectPassengerDeck } from "../reducers/BoardReducer"
import styles from './PassengerDeck.module.scss'
import { planetImages } from "../image_assets/images"

export function PassengerDeck()
{
    const passengerDeck = useSelector( selectPassengerDeck )
    return (
        <div className={ styles.PassengerDeck }>
            {
                passengerDeck.map( ( passenger ) => 
                {
                    const imageUrl = planetImages[passenger];
                    return (
                        <div className={ styles.Passenger }>
                            <img className={ styles.PassengerImage } src={ imageUrl } alt=''></img>
                        </div>
                    )
                })
            }
        </div>
    )
}