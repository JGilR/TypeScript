import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import { UserSchema, types } from "./schemas.ts"
import { Mutation } from "../ExamenFinalOrdinario/resolvers/mutation.ts"
import { Query } from "../ExamenFinalOrdinario/resolvers/query.ts"

import db from "./mongodb.ts";

const resolvers = {
    Query,
    Mutation
}

const app = new Application();


app.use(async (ctx, next) => {

    const value = await ctx.request.body().value;
    
    if(!value || value.operationName === "IntrospectionQuery"){
        await next();
    }else{
        const noAuthResolvers = ["register","registerDriver","logIn","logOut"];
        if(noAuthResolvers.some((elem) => value.query.includes(elem))){
            await next();
        }else{
            const token = ctx.request.headers.get("token") || "none";
            const findUser = await db.collection<UserSchema>("UserCollection").findOne({token});

            if(findUser){

                const clientResolver = [""];
                const driverResolver = [""];
                const adminResolver = ["getCars","getClients","getDrivers"];

                if(adminResolver.some((elem) => value.query.includes(elem))){
                    if(findUser.rol.includes("ADMIN")){
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth Admin error"}
                    }
                }else if(clientResolver.some((elem) => value.query.includes(elem))){
                    if(findUser.rol.includes("CLIENT")){
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth Client error"}
                    }
                }else if(driverResolver.some((elem) => value.query.includes(elem))){
                    if(findUser.rol.includes("DRIVER")){
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth Driver error"}
                    }
                }

            }else{
                ctx.response.status = 401;
                ctx.response.body = { error: "Auth error" };
            }
        }
    }
  
})


const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: types,
    resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        db,
        user: ctx.state.user,
      };
    },
  });
  
  
  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  
  console.log("Server start at http://localhost:5000");
  await app.listen({ port: 5000 });
