// google typescript branded types

type Brand<K, T> = K & { __brand: T }

export type HexNodeIndex_t = Brand<number, 'HexNodeIndex'>;
export type GridNodeIndex_t = Brand<number, 'GridNodeIndex'>;
export type ConnectionDirection_t = Brand<number, 'ConnectionDirection'>;
export type EdgeIndex_t = Brand<number, 'EdgeIndex'>;
export type EdgeNodeIndex_t = Brand<number, 'EdgeNodeIndex'>;
export type BoardPieceIndex_t = Brand<number, 'BoardPieceIndex'>;

export type PlayerIndex_t = Brand<number, 'PlayerIndex'>;

export type WormholeIndex_t = Brand<number, 'WormHoleIndex'>;

// Connection directions need to be between 0 - 5 since we are working with hexes 
// also mod on a negative number is ass 
export function ValidateConnectionDirection( value: number )
{
    let positiveVal = value;
    while( positiveVal < 0 )
    {
        positiveVal = positiveVal + 6;
    }

    return positiveVal % 6 as ConnectionDirection_t;
}