import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import { helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type { IInvoice, IContext, ClientSchema, ProductSchema } from "../types.ts";
import type { InvoiceSchema } from "../types.ts";


const postInvoice = async (ctx: IContext) => {
    try{
        
        const db: Database = ctx.state.db;
        const invoiceCollection = db.collection<InvoiceSchema>("InvoiceCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");
        const productCollection = db.collection<ProductSchema>("ProductCollection");

        const invoice: Partial<InvoiceSchema> = {
            client_cif: "05209898F",
            products: [{sku: "H12213", amount: 3}, {sku: "H12215", amount: 2}],
        }

        const findClient = await clientCollection.findOne({cif: invoice.client_cif});
        const {sku} = helpers.getQuery(ctx, {mergeParams: true});


        const findProduct = await productCollection.find({sku});

        if(findClient){
            if(findProduct){
                ctx.response.status = 200;
                const addInvoice = await invoiceCollection.insertOne(invoice);
                ctx.response.body = "Accepted";
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Not Found";
            }
        }else{
            ctx.response.status = 404;
            ctx.response.body = "Not Found";
        }


    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postInvoice as default };