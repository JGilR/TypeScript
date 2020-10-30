import type { IContext } from "../../Practica2_Old/types.ts";
import {  helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import type { CarSchema, IClient, ICar, ClientSchema } from "../types.ts";

const postLocate = async(ctx: IContext) => {
    try{

        const db: Database = ctx.state.db;
        const carCollection = db.collection<CarSchema>("CarCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");

        const {id} = helpers.getQuery(ctx, {mergeParams: true});
        const client = await clientCollection.findOne({id: Number(id)});

        if(client){
            const findLocation = await carCollection.findOne({client: client.id});
            ctx.response.status = 200;
            ctx.response.body = {exception: "OK", id: findLocation?.id};
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Client Not Found";
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postLocate as default }