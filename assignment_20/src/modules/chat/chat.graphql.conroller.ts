import { GraphQLList } from "graphql";
import { userType } from "../graphql/graphql.types";
import chatGraphqlServices from "./chat.graphql.services";

export const chatQuery = {
    getChats: {
        type: new GraphQLList(userType),
        resolve: chatGraphqlServices.getChats
    }
}
