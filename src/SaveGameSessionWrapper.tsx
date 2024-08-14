import { useEffect } from "react"
import { store } from "./reducers/RootReducer"
import { SaveGameSession } from "./utils/sessionutils"

export function SaveGameSessionWrapper( props: { children: React.ReactNode })
{
  
    useEffect( () => {
        const fnSaveGameSession = ( ev: BeforeUnloadEvent ) => {
            ev.preventDefault()
            console.log('running unload')
            const gameState = store.getState()
            SaveGameSession( gameState )
        }
        console.log(' adding unload')
        window.addEventListener('beforeunload', fnSaveGameSession)
        return () =>
        {
            console.log('removing unload')
            window.removeEventListener('beforeunload', fnSaveGameSession)
        }
    }, [])

    return <>{ props.children }</>   
}