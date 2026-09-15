import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "../user/user.graphql.conroller";
import { chatQuery } from "../chat/chat.graphql.conroller";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "query",
        fields: {
            ...userQuery,
            ...chatQuery
        }
    }),
})

export default schema;