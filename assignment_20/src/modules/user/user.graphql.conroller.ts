import { GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, ThunkObjMap } from "graphql";
import userGraphqlServices from "./user.graphql.services";
import { userType } from "../graphql/graphql.types";
import { graphQLValidation } from "../../middlewares/validation.middleware";
import { sayHelloData, sayHelloValidation } from "./user.validation";
import { decodedToken, TokenEnum } from "../auth/auth.middleware";

export const userQuery: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {
    getUsers: {
        type: new GraphQLList(userType),
        resolve: userGraphqlServices.getUsers
    },
    sayHello: {
        type: new GraphQLObjectType({
            name: "sayHello",
            fields:{
                userName: {type: GraphQLString},
                userAge: {type: GraphQLInt}
            }
        }),
        args: {
            name: {type: new GraphQLNonNull(GraphQLString)},
            age: {type: GraphQLInt},
            token: {type: GraphQLString}
        },
        resolve: async(_, args: sayHelloData,ctx)=>{
            const name = args.name
            await graphQLValidation(sayHelloValidation, args)
            const {user} = await decodedToken({authorization: ctx.authorization, tokenType: TokenEnum.access})
            
            return {
                userName: name,
                userAge: args.age
            }
        }
    }

}