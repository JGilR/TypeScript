import { Router } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import postClient from "../ExamenParcial/controllers/postClient.ts";
import postProduct from "../ExamenParcial/controllers/postProduct.ts";
import postInvoice from "../ExamenParcial/controllers/postInvoice.ts";

const router = new Router();

const index = (ctx:any) => {
    ctx.response.body = 
    "API de Empresa para un examen:\n\n" + 
    "/status: indica que la API esta lista.\n" +
    "post/client: añade a la base de datos los clientes.\n";
    
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
    .post("/client", postClient)
    .post("/product", postProduct)
    .post("/invoice", postInvoice)


export { router as default }