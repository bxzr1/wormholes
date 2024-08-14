import { useSelector } from "react-redux"
import { selectExplorationStack } from "../reducers/BoardReducer"
import styles from './ExplorationTokens.module.scss'

export function ExplorationTokens()
{
    const explorationStack = useSelector(selectExplorationStack);

    return (
        <div className={ styles.ExplorationStack } >
            {
                explorationStack.map( ( explorationCoin, index ) => {
                    return (
                        <div className={ styles.ExplorationCoin } style={ { top: index * 10, zIndex: index * -1 } }>
                            <div className={ styles.CoinIndex } > 
                                { explorationCoin.explorationIndex + 1 }
                            </div>
                            <div className={ styles.VictoryPoints }>
                                V: { explorationCoin.victoryPoints }
                            </div>
                        </div>
                    )
                })
            }
            <div className={ styles.ExplorationCoin } style={ { top: ( explorationStack.length ) * 10, zIndex: ( explorationStack.length ) * -1 } } >
                <div className={ styles.CoinIndex } > - </div>
            </div>
            <div className={ styles.ExplorationCoin } style={ { top: ( explorationStack.length + 1) * 10, zIndex: ( explorationStack.length + 1 ) * -1 } }>
                <div className={ styles.CoinIndex } > 3 </div>
            </div>
            <div className={ styles.ExplorationCoin } style={ { top: ( explorationStack.length + 2) * 10, zIndex: ( explorationStack.length + 2) * -1 } }>
                <div className={ styles.CoinIndex } > 2 </div>
            </div>
            <div className={ styles.ExplorationCoin } style={ { top: ( explorationStack.length + 3) * 10, zIndex: ( explorationStack.length + 3 ) * -1 }}>
                <div className={ styles.CoinIndex } > 1 </div>
            </div>
        </div>
    )
}