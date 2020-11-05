import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type { IProduct, IContext } from "../types.ts";
import type { ProductSchema } from "../types.ts";

const postProduct = async (ctx: IContext) => {
    try{

        const db: Database = ctx.state.db;
        const productCollection = db.collection<ProductSchema>("ProductCollection");

        const product: Partial<ProductSchema> = {
            sku: "H12215",
            name: "Boligrafo color verde",
            price: 3,
        }

        //* Para insertar desde el postman
        /**
         * const {value} = ctx.resquest.body({type: `json`});
         * const product: Partial<ProductSchema>[] = await value;
         */

        const {cif} = helpers.getQuery(ctx, {mergeParams: true});
        const findProduct = await productCollection.findOne({sku: product.sku});
        if(!findProduct){
            ctx.response.status = 200;
            //* Para poder insertal el cliente desde POSTMAN
            //const insert = await ClientCollection.insertMany(client);

            const addProduct = await productCollection.insertOne(product);
            ctx.response.body = "Accepted";
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Bad Request";
        }

        const data: ProductSchema[] = await productCollection.find({});
        const result = data.map((item) => {
            return {
                sku: item.sku,
                name: item.name,
                price: item.price,
            } as IProduct
        });

        ctx.response.status = 200;
        ctx.response.body = await Promise.all(result);



    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postProduct as default };