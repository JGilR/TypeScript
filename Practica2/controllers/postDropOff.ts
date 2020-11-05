import type{ IContext } from "../../Practica2_Old/types.ts";
import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import type { CarSchema, IClient, ICar, ClientSchema } from "../types.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";

const postDropOff = async (ctx: IContext) => {
    try{
        const db: Database = ctx.state.db;
        const carCollection = db.collection<CarSchema>("CarCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");

        const {id} = helpers.getQuery(ctx, {mergeParams: true});
        const client = await clientCollection.findOne({id: Number(id)});

        if(client){
            const findCar = await carCollection.findOne({client: client.id});
            if(findCar){
                const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {client: 0}});
                const deleteClient = clientCollection.deleteOne({id: client.id});
                if(matchedCount){
                    ctx.response.status = 200;
                    ctx.response.body = "No Content";
                }else{
                    ctx.response.status = 404;
                    ctx.response.body = "Not Found";
                }
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Not Found";
            }
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postDropOff as default }