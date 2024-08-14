import { HexNodeIndex_t } from "./utils/aliasutils";

export const enum NodeType
{
    //unreachable = "unreachable",
    asteroid = 'asteroid',
    star = 'star',
    station='station',
    space = "space",
    planet = "planet",
    nebula = "nebula",
    cannon = "cannon",
    orbit = "orbit"
}

export function isUnreachable( nodeType: NodeType )
{
    return nodeType === NodeType.asteroid || nodeType === NodeType.star || nodeType === NodeType.station || nodeType === NodeType.planet
}

export function GetFuelCost( nodeTypeOrigin: NodeType )
{
    if( nodeTypeOrigin === NodeType.nebula )
    {
        return 0;
    }

    if( nodeTypeOrigin === NodeType.cannon )
    {
        return 0;
    }

    return 1;
}

export const enum PlanetTypes
{
    BlueRed = "BlueRed",
    PinkSaturn = "PinkSaturn",
    GreenBall = "GreenBall",
    IceBall = "IceBall",
    BlackGold = "BlackGold",
    FuzzyOrange = "FuzzyOrange",
    WaterWorld = "WaterWorld",
    FuzzyIce = "FuzzyIce",
    YellowJupiter = "YellowJupiter",
    PurpleEye = "PurpleEye"
}

export interface NodeDescription
{
    type: NodeType;
    name?: PlanetTypes;
}

export const orbitNodesIndicies: HexNodeIndex_t[] = 
[ 
    4 as HexNodeIndex_t, 
    5 as HexNodeIndex_t, 
    8 as HexNodeIndex_t, 
    10 as HexNodeIndex_t, 
    13 as HexNodeIndex_t, 
    14 as HexNodeIndex_t 
];

export const template: NodeDescription[][] = [
    //0
    [{ type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.orbit},
    { type: NodeType.orbit},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.orbit},
    { type: NodeType.station},
    { type: NodeType.orbit},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.orbit},
    { type: NodeType.orbit},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space}],
    //1
    [{ type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.planet, name: PlanetTypes.BlueRed},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.star},
    { type: NodeType.star},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.star},
    { type: NodeType.star},
    { type: NodeType.star},
    { type: NodeType.space},
    { type: NodeType.star},
    { type: NodeType.star},
    { type: NodeType.space}],
    //2
    [{ type: NodeType.nebula},
     { type: NodeType.nebula},
     { type: NodeType.nebula},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.planet, name: PlanetTypes.PinkSaturn},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space}],
    //3
    [{ type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.planet, name: PlanetTypes.GreenBall },
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space}],
    //4
    [{ type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.cannon},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.planet, name: PlanetTypes.IceBall },
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.space},
     { type: NodeType.asteroid},
     { type: NodeType.space},
     { type: NodeType.space}],
    //5
    [{ type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.planet, name: PlanetTypes.BlackGold },
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.planet, name: PlanetTypes.FuzzyOrange },
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space}],
    //6
    [{ type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.asteroid},
    { type: NodeType.planet, name: PlanetTypes.WaterWorld},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space}],
    //7
    [{ type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.planet, name: PlanetTypes.FuzzyIce},
    { type: NodeType.space}],
    //8
    [{ type: NodeType.space},
    { type: NodeType.nebula},
    { type: NodeType.nebula},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.planet, name: PlanetTypes.YellowJupiter},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space}],
    //9
    [{ type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.planet, name: PlanetTypes.PurpleEye},
    { type: NodeType.space},
    { type: NodeType.asteroid},
    { type: NodeType.asteroid},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.space},
    { type: NodeType.asteroid}],
]