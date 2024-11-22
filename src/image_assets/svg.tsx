export function SpaceShipSVG()
{
    return(
        <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4.5" cy="4.5" r="4.5" fill="currentColor"/>
            <circle cx="4.5" cy="4.5" r="1.5" fill="#FFFFFF"/>
            <rect y="10" width="2" height="3" fill="currentColor"/>
            <rect x="7" y="10" width="2" height="3" fill="currentColor"/>
            <rect x="3" y="7" width="3" height="6" fill="currentColor"/>
            <circle cx="8" cy="10" r="1" fill="#currentColor"/>
            <circle cx="1" cy="10" r="1" fill="currentColor"/>
        </svg>

    )
}

export function WormholeActiveSVG()
{
    return(
        <svg width="50" height="52" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="25" cy="10" rx="25" ry="10" fill="currentColor"/>
            <ellipse cx="25" cy="42" rx="25" ry="10" fill="white"/>
            <ellipse cx="25" cy="40.5" rx="14" ry="4.5" fill="currentColor"/>
            <ellipse cx="25" cy="7.5" rx="14" ry="4.5" fill="white"/>
            <path d="M11 13H39L32.913 19.5571L31.087 23.4143V26.8857V30.7429L32.913 33.8286L39 40H11L17.087 33.8286L18.913 30.7429V26.8857V23.0286L17.087 19.5571L11 13Z" fill="currentColor"/>
        </svg>
    )
}

export function WormholeInactiveSVG()
{
    return(
        <svg width="50" height="52" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="25" cy="10" rx="25" ry="10" fill="currentColor"/>
        <ellipse cx="25" cy="42" rx="25" ry="10" fill="white"/>
        <ellipse cx="25" cy="40.5" rx="14" ry="4.5" fill="currentColor"/>
        <ellipse cx="25" cy="7.5" rx="14" ry="4.5" fill="white"/>
        <path d="M38.5 7.5C38.5 7.89449 38.251 8.35672 37.5973 8.85351C36.9514 9.34435 35.9852 9.8078 34.7465 10.206C32.2747 11.0005 28.8287 11.5 25 11.5C21.1713 11.5 17.7253 11.0005 15.2535 10.206C14.0148 9.8078 13.0486 9.34435 12.4027 8.85351C11.749 8.35672 11.5 7.89449 11.5 7.5C11.5 7.10551 11.749 6.64328 12.4027 6.14649C13.0486 5.65565 14.0148 5.1922 15.2535 4.79403C17.7253 3.99952 21.1713 3.5 25 3.5C28.8287 3.5 32.2747 3.99952 34.7465 4.79403C35.9852 5.1922 36.9514 5.65565 37.5973 6.14649C38.251 6.64328 38.5 7.10551 38.5 7.5Z" stroke="black"/>
        <path d="M11 13H39L32.913 19.5571L31.087 23.4143V26.8857V30.7429L32.913 33.8286L39 40H11L17.087 33.8286L18.913 30.7429V26.8857V23.0286L17.087 19.5571L11 13Z" fill="currentColor"/>
        <path d="M16 4.5L34 10.5" stroke="black"/>
        <path d="M34 4.5L15 10" stroke="black"/>
        </svg>
    )
}