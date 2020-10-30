import { Router } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import putCars from "../Practica2/controllers/putCars.ts"
import postJorney from "../Practica2/controllers/postJourney.ts"
import postLocation from "../Practica2/controllers/postLocate.ts"

const router = new Router();

const index = (ctx:any) => {
    ctx.response.body = 
    "Welcome to my CAR API\nYou are ready to use this API:\n\n" + 
    "/status: to get the API status.\n";
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
    .post("/location/:id", postLocation)



export { router as default }