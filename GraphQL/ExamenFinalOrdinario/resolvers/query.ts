import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import type { IContext, IUser, UserSchema, ClientSchema, CarSchema, DriverSchema } from "../schemas.ts"
import db from "../mongodb.ts";

const userCollection = db.collection<UserSchema>("UserCollection");
const clientCollection = db.collection<ClientSchema>("ClientCollection");
const carCollection = db.collection<CarSchema>("CarCollection");
const driverCollection = db.collection<DriverSchema>("DriverCollection");

const Query = {

    getCars: async (parent: any, args: any, ctx: IContext) => {
        try{

            return await carCollection.find();

        }catch (e){
            throw new GQLError(e);
        }
    },

    getClients: async (parent: any, args: any, ctx: IContext) => {
        try{

            return await clientCollection.find();

        }catch (e){
            throw new GQLError(e);
        }
    },

    getDrivers: async (parent: any, args: any, ctx: IContext) => {
        try{

            return await driverCollection.find();

        }catch (e){
            throw new GQLError(e);
        }
    },


}

export { Query };