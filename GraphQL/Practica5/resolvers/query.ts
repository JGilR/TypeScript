import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import type { IContext, IBlog, IUser, UserSchema, BlogSchema } from "../schemas.ts"
import db from "../mongodb.ts";

const blogCollection = db.collection<BlogSchema>("BlogCollection");
const userCollection = db.collection<UserSchema>("UserCollection");


const Query = {

    getPosts: async (parent: any, args: any, ctx: IContext) => {
        try{

            return await blogCollection.find();

        }catch (e){
            throw new GQLError(e);
        }
    }

}

export { Query };