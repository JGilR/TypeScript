import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import type { IContext, IUser, UserSchema, DriverSchema, ClientSchema, ICar, CarSchema } from "../schemas.ts"
import db from "../mongodb.ts";

const userCollection = db.collection<UserSchema>("UserCollection");
const clientCollection = db.collection<ClientSchema>("ClientCollection");
const carCollection = db.collection<CarSchema>("CarCollection");
const driverCollection = db.collection<DriverSchema>("DriverCollection");

const Mutation = {

    logIn: async (parent: any, args: { email: string, password: string }, ctx: IContext): Promise<string> => {
        try{

            const findUser = await userCollection.findOne({email: args.email, password: args.password});
            if(findUser){
                const token = v4.generate();
                await userCollection.updateOne({email: args.email}, {$set: {token}});
                return token;
            }else{
                throw new GQLError("Invalid user or password.");
            }

        }catch (e){
            throw new GQLError(e);
        }
    },  

    logOut: async (parent: any, args: {}, ctx: IContext): Promise<Boolean> => {
        try{

            const findUser = await userCollection.findOne({email: ctx.user.email, token: ctx.user.token});
            if(findUser){
                await userCollection.updateOne({email: ctx.user.email}, {$set: { token: "" }});
                return true;
            }else{
                throw new GQLError("Unexpected Error.");
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    register: async (parent: any, args: {email: string, password: string, rol: string}, ctx: IContext): Promise<Boolean> => {
        try{

            const findUser = await userCollection.findOne({email: args.email});
            if(findUser){
                throw new GQLError(`User with email ${args.email} already exists.`);
            }
            // Registramos un usuario, CLIENT, DRIVER o ADMIN
            await userCollection.insertOne({ email: args.email, password: args.password, rol: args.rol });
            return true;

        }catch (e){
            throw new GQLError(e);
        }
    },

    registerDriver: async (parent: any, args: {email: string, password: string, car: ICar}, ctx: IContext) => {
        try{

            const findDriver = await driverCollection.findOne({email: args.email});
            if(findDriver){
                throw new GQLError(`Driver with email ${args.email} already exists.`);
            }else{
                await userCollection.insertOne({email: args.email, password: args.password, rol: "DRIVER"});
                await driverCollection.insertOne({email: args.email, car: {
                    matricula: args.car.matricula, 
                    disponibility: args.car.disponibility, 
                    driver: ctx.driver,
                }})
                await carCollection.insertOne({matricula: args.car.matricula, disponibility: args.car.disponibility, driver: ctx.driver,})
                return true;
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    registerClient: async (parent: any, args: {email: string, password: string}, ctx: IContext) =>{
        try{

            const findClient = await clientCollection.findOne({email: args.email});
            if(findClient){
                throw new GQLError(`Driver with email ${args.email} already exists.`);
            }else{
                await userCollection.insertOne({email: args.email, password: args.password, rol: "CLIENT"});
                await clientCollection.insertOne({email: args.email});
                return true;
            }

        }catch (e){
            throw new GQLError(e);
        }
    },
    

}

export { Mutation };