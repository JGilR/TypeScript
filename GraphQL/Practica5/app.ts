import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import { UserSchema, types } from "./schemas.ts"
import { Mutation } from "../Practica5/resolvers/mutation.ts"
import { Query } from "../Practica5/resolvers/query.ts"

import db from "./mongodb.ts";


/**
 *  Este apartado lo hemos realizado Luis Diaz, Oscar Gonzalez y yo.
 */

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
        const noAuthResolvers = ["logIn"];
        if(noAuthResolvers.some((elem) => value.query.includes(elem))){
            await next();
        }else{
            const token = ctx.request.headers.get("token") || "none";
            const findUser = await db.collection<UserSchema>("UserCollection").findOne({token});

            if(findUser){
                const authNeed = ["getPosts", "logOut"];
                const authNeedAdmin = ["createUser", "deleteUser"];
                const authNeedAuthor = ["createPost", "deletePost"];
                const authNeedUser = ["createComment"];
                
                // Si encuentra al user
                if(authNeed.some((elem) => value.query.includes(elem))){
                    ctx.state.user = findUser;
                    await next();

                }
                // Si encuentra al user y este tiene el rol ADMIN
                else if(authNeedAdmin.some((elem) => value.query.includes(elem))){
                    if(findUser.rol.includes("ADMIN")){
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth Admin error"}
                    }
                }
                
                // Si encuentra al user y este tiene el rol AUTHOR
                else if(authNeedAuthor.some((elem) => value.query.includes(elem))){
                    if(value.query.includes("deletePost")){
                        if(findUser.rol.includes("AUTHOR") || findUser.rol.includes("EDITOR")){
                            ctx.state.user = findUser;
                            await next();
                        }else{
                            ctx.response.status = 401;
                            ctx.response.body = {error: "Auth Author error"};
                        }
                    }
                    else if(findUser.rol.includes("AUTHOR")){
                        ctx.state.user = findUser;
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth Author error"}
                    }
                }
                
                // Si encuentra al user y este tiene el rol USER
                else if(authNeedUser.some((elem) => value.query.includes(elem))){
                    if(findUser.rol.includes("USER")){
                        ctx.state.user = findUser;
                        await next();
                    }else{
                        ctx.response.status = 401;
                        ctx.response.body = {error: "Auth User error"}
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
  
  console.log("Server start at http://localhost:4000");
  await app.listen({ port: 4000 });
