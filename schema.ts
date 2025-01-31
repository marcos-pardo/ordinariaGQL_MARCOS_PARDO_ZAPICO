export const schema =  `#graphql

type Restaurant{
    _id:ID!
    nombreRestaurante:String!
    Direccion:String!
    phone:String!
    temperatura:Int
    horaActual:String
}

type Query{
    getRestaurant(id:ID!): Restaurant!
    getRestaurants: [Restaurant!]
}
type Mutation{
    addRestaurant(nombreRestaurante:String!,direccionRestaurante:String!,ciudad:String!,phone:String!): Restaurant
    deleteRestaurant(id:ID!): Boolean
}

`