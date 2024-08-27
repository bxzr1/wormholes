import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from './Tooltip.module.scss'
import ReactDOM from "react-dom";
import classnames from 'classnames';

interface TooltipRootContext_t {
    rootRef: React.RefObject<HTMLElement> | null
}
const TooltipRootContext = createContext<TooltipRootContext_t>( { rootRef: null } );

export function TooltipRootProvider( props: { rootRef: React.RefObject<HTMLElement>, children: React.ReactNode})
{
    const { rootRef, children } = props; 
    const value = useMemo( () => {
        return { rootRef }
    }, [ rootRef ] );

   return (
        <TooltipRootContext.Provider value={ value }>
            { children }
        </TooltipRootContext.Provider>
   )
}

function useTooltipRootRef()
{
    return useContext( TooltipRootContext ).rootRef
}

export enum ETooltipPosition {
    top = 'top',
    bottom = 'bottom',
    left = 'left',
    right = 'right'
}

interface TooltipPosition {
    top?: number,
    left?: number,
}

export function useTooltip( contents: React.ReactNode, sourceRef: React.RefObject<HTMLDivElement>, position: ETooltipPosition )
{
    const [ isVisible, setIsVisible ] = useState< boolean >( false );

    const tooltipContent = <TooltipContents sourceRef={ sourceRef } isVisible={ isVisible } position={ position }>{ contents }</TooltipContents>
    
    return { tooltipContent, setIsVisible }
}

function TooltipContents( props: { sourceRef: React.RefObject<HTMLDivElement>, children: React.ReactNode, isVisible: boolean, position: ETooltipPosition })
{
    const { sourceRef, isVisible, children, position } = props; 
    const rootRef = useTooltipRootRef();
    const contentRef = useRef<HTMLDivElement>( null );
    const [ tooltipPosition, setTooltipPosition ] = useState<TooltipPosition>();

    useLayoutEffect( () => {
        if( !rootRef?.current || !sourceRef.current || !contentRef.current || !isVisible )
            return;

        const sourceRect = sourceRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect(); 

        const sourceRectHorizontalCenter = sourceRect.left + ( sourceRect.right - sourceRect.left ) * 0.5;
        const centeredLeft = sourceRectHorizontalCenter - ( contentRect.width * 0.5);

        const sourceRectVerticalCenter = sourceRect.top + ( sourceRect.bottom - sourceRect.top ) * 0.5;
        const centeredTop = sourceRectVerticalCenter - ( contentRect.height ) * 0.5;

        if( position === ETooltipPosition.top )
        {
            setTooltipPosition({
                top: sourceRect.top - contentRect.height,
                left: centeredLeft,
            })
        }
        else if ( position === ETooltipPosition.bottom )
        {
            setTooltipPosition({
                top: sourceRect.bottom, 
                left: centeredLeft,
            })
        }
        else if ( position === ETooltipPosition.left )
        {
            setTooltipPosition({
                top: centeredTop,
                left: sourceRect.left - contentRect.width, 
            })
        }
        else
        {
            setTooltipPosition({
                top: centeredTop,
                left: sourceRect.right,
            })
        }

    }, [sourceRef, contentRef, position, rootRef, isVisible ])

    if( !rootRef?.current )
        return null;

    return ReactDOM.createPortal( 
        <div 
            ref={ contentRef }
            className={ classnames( styles.TooltipCtn, isVisible && styles.Visible, styles[position] ) }
            style={ tooltipPosition ?? {} }
        >
            <div className={ styles.TooltipContent }>{ children }</div>
            <div className={ classnames( styles.Arrow, styles[position]) }/>
        </div>,
        rootRef.current
    ) 
}