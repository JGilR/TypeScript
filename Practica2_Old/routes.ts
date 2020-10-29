import { Router } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import getCharacterID from "./controllers/getCharacterID.ts";
import getCharacters from "./controllers/getCharacters.ts";


//* Definimos las rutas para hacer GET, POST, DELETE
const router = new Router();

const index = (ctx:any) => {
    ctx.response.body = 
    "Welcome to Rick y Morty API\nYou are ready to use this API:\n\n" + 
    "GET: '/characters' returns all character from my MongoDB\n" + 
    "GET: '/episodes' returns all episodes from my MongoDB\n" + 
    "GET: '/locations' returns all locations from my MongoDB\n";
}

const status = (ctx:any) => {
    ctx.response.status = 200;
    ctx.response.body = "OK";
}

router
    .get("/", index)
    .get("/status", status);


// TODO: CHARACTERS
router
    .get("/characters", getCharacters)
    .get("/characters/:id", getCharacterID);
    

/*
//TODO: EPISODES
router
    .get("/episodes", getEpisodes)
    .get("/episodes/:id", getEpisodeId);

//TODO: LOCATIONS
router
    .get("/locations", getLocations)
    .get("/locations/:id", getLocationId);
*/

export { router as default };
