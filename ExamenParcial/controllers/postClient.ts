import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type { IClient, IContext } from "../types.ts";
import type { ClientSchema } from "../types.ts";

const postClient = async (ctx: IContext) => {
    try{

        const db: Database = ctx.state.db;
        const clientCollection = db.collection<ClientSchema>("ClientCollection");

        const client: Partial<ClientSchema> = {
            cif: "05209898F",
            name: "Jorge Gil",
            address: "Calle Purpura 76, 28283 Madrid",
            phone: "699132455",
            mail: "jgilr@alumnos.nebrija.es",
        }

        //* Para insertar desde el postman
        /**
         * const {value} = ctx.resquest.body({type: `json`});
         * const client: Partial<ClientSchema>[] = await value;
         */

        const {cif} = helpers.getQuery(ctx, {mergeParams: true});
        const findClient = await clientCollection.findOne({cif: client.cif});
        if(!findClient){
            ctx.response.status = 200;
            //* Para poder insertal el cliente desde POSTMAN
            //const insert = await ClientCollection.insertMany(client);

            const addClient = await clientCollection.insertOne(client);
            ctx.response.body = "Accepted";
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Bad Request";
        }

        const data: ClientSchema[] = await clientCollection.find({});
        const result = data.map((item) => {
            return {
                cif: item.cif,
                name: item.name,
                address: item.address,
                phone: item.phone,
                mail: item.mail,
            } as IClient
        });

        ctx.response.status = 200;
        ctx.response.body = await Promise.all(result);



    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postClient as default };