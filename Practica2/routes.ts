import { Router } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import putCars from "../Practica2/controllers/putCars.ts"
import postJorney from "../Practica2/controllers/postJourney.ts"
import postLocation from "../Practica2/controllers/postLocate.ts"

const router = new Router();

const index = (ctx:any) => {
    ctx.response.body = 
    "Welcome to my CAR API\nYou are ready to use this API:\n\n" + 
    "/status: get the API status.\n" +
    "/cars: introduce some cars and reset our DB.\n" +
    "/journey: one client rent a car.\n" +
    "/locate/:id: return the rented car and his data.\n" ;
    
}

const status = (ctx:any) => {
    try{
        ctx.response.status = 200;
        ctx.response.body = "OK";
    }catch(e){
        ctx.response.status = 500;
        console.error(e);
    }
}

router
    .get("/", index)
    .get("/status", status)
    .put("/cars", putCars)
    .post("/journey", postJorney)
    .post("/locate/:id", postLocation)



export { router as default }