import { OptionalId } from "mongodb"

export type RestaurantModel = OptionalId<{
    nombreRestaurante: string,
    Direccion: string,
    ciudad:string,
    phone:string
    timezone:string,
    latitude: number,
    longitude: number,
    

}>
export type Restaurant = {
    nombreRestaurante: string,
    direccionRestaurante: string,
    ciudad:string,
    phone:string

}

export type APIPHONE = {
    is_valid:boolean
    timezones:string
    country:string

}
export type APICITY = {
    latitude: number,
    longitude: number,

}
export type APITIME= {
    datetime:string

}
export type APICLIMA= {
    temp:number

}



