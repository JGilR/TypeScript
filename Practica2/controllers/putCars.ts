import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import type { CarSchema, ClientSchema, ICar } from "../types.ts";
import type { IContext } from "../types.ts";

const putCars = async (ctx: IContext) => {
    try{
        
        const db: Database = ctx.state.db;
        const carCollection = db.collection<CarSchema>("CarCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");

        await carCollection.deleteMany({});
        await clientCollection.deleteMany({});

        const insertCars = await carCollection.insertMany([
            {
                id: 1,
                seats: 4,
                status: false,
            },
            {
                id: 2,
                seats: 5,
                status: false,
            },
            {
                id: 3,
                seats: 6,
                status: false,
            },
            
        ])

        //* Para insertar desde el postman
        /**
         * const {value} = ctx.resquest.body({type: `json`});
         * const car: Partial<CarSchema>[] = await value;
         * const insert = await CarCollection.insertMany(car);
         */

        
        const data: CarSchema[] = await carCollection.find({});
        const result = data.map((item) => {
            return {
                id: item.id,
                seats: item.seats,
            } as ICar
        });

        ctx.response.status = 200;
        ctx.response.body = await Promise.all(result);

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { putCars as default }