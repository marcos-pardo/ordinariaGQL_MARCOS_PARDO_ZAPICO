import { ObjectId, Collection} from "mongodb"
import{RestaurantModel,Restaurant, APIPHONE, APICITY, APITIME,APICLIMA} from "./types.ts"
import { GraphQLError } from "graphql";

type addArgs={
    nombreRestaurante: string,
    direccionRestaurante: string,
    ciudad:string,
    phone:string
}

type addQuery={
    id:string
}

type Context = {
    RestaurantesCollection : Collection<RestaurantModel>
}
export const resolvers ={

    Mutation:{
        addRestaurant: async(_:unknown, args: addArgs, ctx:Context ): Promise <RestaurantModel> =>{
            const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new Error("No hay APIKEY")
            
            const {nombreRestaurante,direccionRestaurante,ciudad,phone} = args
            console.log(direccionRestaurante)
            const numeroExists = await ctx.RestaurantesCollection.countDocuments({phone:args.phone})
            if(numeroExists >=1) throw new GraphQLError("el numero ya existe")

            const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`
            

            const data = await fetch (url,{
                headers:{
                    'X-Api-Key': API_KEY
                }
            })
            if(data.status != 200) throw new GraphQLError("API NINJA PHONE ERROR")

            const response:APIPHONE = await data.json()
            
            const is_valid = response.is_valid
            const timezone = response.timezones[0]
            const country = response.country

            


            const url2 = `https://api.api-ninjas.com/v1/city?name=${ciudad}`
            console.log(url2)

            const data2 = await fetch (url2,{
                headers:{
                    'X-Api-Key': API_KEY
                }
            })
            if(data.status != 200) throw new GraphQLError("API NINJA CITY ERROR")
                const response2:APICITY[] = await data2.json()

                const latitude = response2[0].latitude
                const longitude = response2[0].longitude

                const Direccion = (`${direccionRestaurante},${ciudad},${country}`)
                console.log(Direccion)


            if(is_valid === false) throw new GraphQLError("el movil no es valido")
            
                const {insertedId} = await ctx.RestaurantesCollection.insertOne({
                    nombreRestaurante,
                    Direccion,
                    ciudad,
                    phone,
                    timezone,
                    latitude,
                    longitude
                })

                return {
                    _id:insertedId,
                    nombreRestaurante,
                    Direccion,
                    ciudad,
                    phone,
                    timezone ,
                    latitude,
                    longitude

                }

        },
        deleteRestaurant: async(_:unknown, args: addQuery, ctx:Context ): Promise <boolean> =>{

            const {deletedCount} = await ctx.RestaurantesCollection.deleteOne({_id: new ObjectId(args.id)})
            return deletedCount ===1

        },

    },


    Query:{
        getRestaurant:  async(_:unknown, args: addQuery, ctx:Context ): Promise <RestaurantModel | null> =>{

            return await ctx.RestaurantesCollection.findOne({_id: new ObjectId(args.id)})

        },
        getRestaurants:  async(_:unknown, __:unknown, ctx:Context ): Promise <RestaurantModel[]> =>{

            return await ctx.RestaurantesCollection.find().toArray()

        }
            
        },

        Restaurant:{
            _id: (parent:RestaurantModel): string => parent._id!.toString(),
            horaActual: async(parent:RestaurantModel): Promise<string> =>{
                const API_KEY = Deno.env.get("API_KEY")
            if(!API_KEY) throw new Error("No hay APIKEY")
                const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${parent.timezone}`

            const data = await fetch (url,{
                headers:{
                    'X-Api-Key': API_KEY
                }
            })
            if(data.status != 200) throw new GraphQLError("API NINJA PHONE ERROR")
                const response:APITIME = await data.json()

            const datetime = response.datetime

            const hora= datetime.split(" ")[1].split(":")[0];
            const minuto= datetime.split(" ")[1].split(":")[2];
            const date = `${hora}:${minuto}`
        
           
            return date


            
            },
            temperatura: async(parent:RestaurantModel): Promise<number> =>{
                const lat = parent.latitude
                const lon = parent.longitude

                const API_KEY = Deno.env.get("API_KEY")
                if(!API_KEY) throw new Error("No hay APIKEY")
                    const url = `https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`
    
                const data = await fetch (url,{
                    headers:{
                        'X-Api-Key': API_KEY
                    }
                })
                if(data.status != 200) throw new GraphQLError("API NINJA PHONE ERROR")
                    const response:APICLIMA = await data.json()
    
                const temp = response.temp
                return temp

            }

        }
    
    }
