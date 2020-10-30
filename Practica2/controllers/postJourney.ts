import type { IContext } from "../../Practica2_Old/types.ts";
import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import type { CarSchema, IClient, ICar, ClientSchema } from "../types.ts";


//* Esta función la he realizado con ayuda de Luis Diaz.
const postJourney = async (ctx: IContext) => {
    try{

        const db: Database = ctx.state.db;
        const carCollection = db.collection<CarSchema>("CarCollection");
        const clientCollection = db.collection<ClientSchema>("ClientCollection");

        const client: Partial<ClientSchema> = {
            id: 3,
            people: 1,
        }

        if(client.people as number < 1 || client.people as number > 6){
            ctx.response.status = 400;
            ctx.response.body = "Bad Request";
        }
        //* Buscamos coches cuando las personas son 1, 2, 3 o 4
        else if(client.people as number > 0 && client.people as number < 5){
            ctx.response.status = 200;
            //* Buscamos coche de cuatro asientos y que no este ocupado
            const findCar = await carCollection.findOne({seats: 4, status: false});
            if(findCar){
                const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                if(matchedCount){
                    const insertClient = await clientCollection.insertOne(client);
                    ctx.response.status = 202;
                    ctx.response.body = "Accepted";
                }
            }else{
                //* Si no encuentra un coche de cuatro asientos, buscamos uno de cinco
                const findCar = await carCollection.findOne({seats: 5, status: false});
                if(findCar){
                    const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                    if(matchedCount){
                        const insertClient = await clientCollection.insertOne(client);
                        ctx.response.status = 202;
                        ctx.response.body = "Accepted";
                    }
                }else{
                    //* Si no encuentra un coche de cinco asientos, buscamos uno de seis
                    const findCar = await carCollection.findOne({seats: 6, status: false});
                    if(findCar){
                        const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                        if(matchedCount){
                            const insertClient = await clientCollection.insertOne(client);
                            ctx.response.status = 202;
                            ctx.response.body = "Accepted";
                        }
                    }else{
                        ctx.response.status = 404;
                        ctx.response.body = "Car not found";
                    }
                }
            }
        }
        //* Buscamos coches cuando las personas son 5 o 6
        else if(client.people as number === 5){
            ctx.response.status = 200;
            const findCar = await carCollection.findOne({seats: 5, status: false});
            if(findCar){
                const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                if(matchedCount){
                    const insertClient = await clientCollection.insertOne(client);
                    ctx.response.status = 202;
                    ctx.response.body = "Accepted";
                }
            }else{
                //* Si no encuentra un coche de cinco asientos, buscamos uno de seis
                const findCar = await carCollection.findOne({seats: 6, status: false});
                if(findCar){
                    const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                    if(matchedCount){
                        const insertClient = await clientCollection.insertOne(client);
                        ctx.response.status = 202;
                        ctx.response.body = "Accepted";
                    }
                }else{
                    ctx.response.status = 404;
                    ctx.response.body = "Car not found";
                }
            }
        }
        //* Buscamos coches cuando las pesonas son 6
        else if(client.people as number === 6){
            ctx.response.status = 200;
            const findCar = await carCollection.findOne({seats: 6, status: false});
            if(findCar){
                const {matchedCount} = await carCollection.updateOne({id: findCar.id}, {$set: {status: true, client: client.id}});
                if(matchedCount){
                    const insertClient = await clientCollection.insertOne(client);
                    ctx.response.status = 202;
                    ctx.response.body = "Accepted";
                }
            }else{
                ctx.response.status = 404;
                ctx.response.body = "Car not found";
            }
        }

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
}

export { postJourney as default }