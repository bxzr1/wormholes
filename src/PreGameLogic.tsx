import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPlayer } from "./reducers/PlayerReducer";

export function PreGameLogic() {

    const dispatch = useDispatch();
    
    const [numPlayers, setNumPlayers] = useState<number>(2);
    const [isErrorShowing, setIsErrorShowing] = useState(false);

    const handleSetNumPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (parseInt(e.target.value) > 3 || parseInt(e.target.value) < 2) {
            setNumPlayers(parseInt(e.target.value));
            setIsErrorShowing(true);
            return;
        };
        setIsErrorShowing(false);
        setNumPlayers(parseInt(e.target.value));
    }

    const handleStartGame = () => {
        for (let i=0; i<numPlayers; i++) {
            dispatch(addPlayer({ name: `Player ${i+1}`, score: 0, hexLocation: null }))
        }
    };

    return (
        <div style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flex: '1', flexWrap: 'wrap', flexDirection: 'column', rowGap: 8}}>
            <label style={{color: 'white'}} htmlFor="numberOfPlayers">Number of Players: </label>
            <input style={{fontSize: '36px'}} type="number" id="numberOfPlayers" min="2" max="3" value={numPlayers} onChange={handleSetNumPlayers} />
            <button style={{fontSize: '36px'}} disabled={numPlayers > 3 || numPlayers < 2} onClick={handleStartGame}>Start Game</button>
            <p style={{visibility: isErrorShowing ? 'visible' : 'hidden', color: 'hotpink', fontSize: '36px'}} >Number too large or too small. Please select 2 or 3.</p>
        </div>
    );
};
