import { PlanetTypes } from "../template";

export const space_1 = require('./space_images/space_1.png');
export const space_2 = require('./space_images/space_2.png');
export const space_3 = require('./space_images/space_3.png');

export const nebula_1 = require('./nebula_images/nebula_1.png');
export const nebula_2 = require('./nebula_images/nebula_2.png');
export const nebula_3 = require('./nebula_images/nebula_3.png');

export const asteroid_1 = require('./asteroid_images/asteroid_1.png');
export const asteroid_2 = require('./asteroid_images/asteroid_2.png');
export const asteroid_3 = require('./asteroid_images/asteroid_3.png');

export const sun_1 = require('./star_images/sun_1.png');
export const sun_2 = require('./star_images/sun_2.png');
export const sun_3 = require('./star_images/sun_3.png');
export const sun_4 = require('./star_images/sun_4.png');
export const sun_5 = require('./star_images/sun_5.png');
export const sun_6 = require('./star_images/sun_6.png');
export const sun_7 = require('./star_images/sun_7.png');
export const sun_8 = require('./star_images/sun_8.png');

export const planet_BlueRed: string = require('./planet_images/planet_BlueRed.png');
export const planet_PinkSaturn: string = require('./planet_images/planet_PinkSaturn.png');
export const planet_GreenBall: string = require('./planet_images/planet_GreenBall.png');
export const planet_IceBall: string = require('./planet_images/planet_IceBall.png');
export const planet_BlackGold: string = require('./planet_images/planet_BlackGold.png');
export const planet_FuzzyOrange: string = require('./planet_images/planet_FuzzyOrange.png');
export const planet_WaterWorld: string = require('./planet_images/planet_WaterWorld.png');
export const planet_FuzzyIce: string = require('./planet_images/planet_FuzzyIce.png');
export const planet_YellowJupiter: string  = require('./planet_images/planet_YellowJupiter.png');
export const planet_PurpleEye: string = require('./planet_images/planet_PurpleEye.png');

export const spaceStation = require('./station.png');
export const stationOrbit = require('./station_orbit.png');
export const orbit = require('./orbit.png');
export const spaceCannon = require('./space_gun.png');

export const spaceImages = [
    space_1, space_2, space_3,
]

export const nebulaImages = [
    nebula_1, nebula_2, nebula_3
]

export const asteroidImages = [
    asteroid_1, asteroid_2, asteroid_3
]

export const cannonImage = [
    spaceCannon,
]

export const stationImages = [
    spaceStation, orbit
]

export const sunImages = [
    sun_1, sun_2, sun_3, sun_4, sun_5, sun_6,sun_7, sun_8,
]

export const planetImages = {
    [PlanetTypes.BlueRed] : planet_BlueRed,
    [PlanetTypes.PinkSaturn] : planet_PinkSaturn,
    [PlanetTypes.GreenBall] : planet_GreenBall,
    [PlanetTypes.IceBall] : planet_IceBall,
    [PlanetTypes.BlackGold] : planet_BlackGold,
    [PlanetTypes.FuzzyOrange] : planet_FuzzyOrange,
    [PlanetTypes.WaterWorld] : planet_WaterWorld,
    [PlanetTypes.FuzzyIce] : planet_FuzzyIce,
    [PlanetTypes.YellowJupiter] : planet_YellowJupiter,
    [PlanetTypes.PurpleEye] : planet_PurpleEye,
}

export const leftclick = require('./icons/leftclick.png')
export const rightclick = require('./icons/rightclick.png')
