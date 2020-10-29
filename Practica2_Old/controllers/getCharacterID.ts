import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";
import {  helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import type {
    CharacterSchema,
    EpisodeSchema,
    LocationSchema,
    ICharacter,
} from "../types.ts";

import type { IContext } from "../types.ts";


const getCharacterID = async (ctx: IContext) => {
    try{

        const db: Database = ctx.state.db;
        const characterCollection = db.collection<CharacterSchema>("CharacterCollection");
        const episodeCollection = db.collection<EpisodeSchema>("EpisodeCollection");
        const locationCollection = db.collection<LocationSchema>("LocationCollection");

        const {id} = helpers.getQuery(ctx, {mergeParams: true});
        const character = await characterCollection.findOne({id: Number(id)});
        if(!character){
            ctx.response.body = "Character not found";
            ctx.response.status = 404;
            return;
        }

        // TODO: map origin, location and episodes ids to names
        let location: Partial<LocationSchema> | null = await locationCollection.findOne({ id: character!.location });
        if (!location) {
            location = { name: "Unknown" };
        }

        let origin:Partial<LocationSchema> | null = await locationCollection.findOne({ id: character!.origin, });
        if (!origin) {
            origin = { name: "Unknown" };
        }

        const episode = await episodeCollection.find({
            id: { $in: character!.episode },
        });

        if (episode.length !== character!.episode.length) {
            throw new Error("Episode id not found.");
        }

        ctx.response.status = 200;
        ctx.response.body = {
            ...character,
            location: location!.name,
            origin: origin!.name,
            episode: episode.map((ep) => ep.name),
        };

    }catch(e){
        ctx.response.status = 500;
        ctx.response.body = `Unexpected Error: ${e.message}`;
    }
};

export { getCharacterID as default };