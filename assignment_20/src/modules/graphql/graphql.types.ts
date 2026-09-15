import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";


export const userType = new GraphQLObjectType({
    name: "user_type",
    fields: {
        name:{
            type: GraphQLString
        },
        age:{
            type: GraphQLInt
        }
    }
})
