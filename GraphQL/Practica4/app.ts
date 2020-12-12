import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import { IUser, types } from "./schemas.ts"
import { resolvers } from "./resolvers.ts"
import db from "./mongodb.ts";

const app = new Application();


app.use(async (ctx, next) => {
  //console.log(ctx.request.headers.get("token"));
  const value = await ctx.request.body().value;
  const validQuery = ["logIn", "signIn"];
  const userCollection = db.collection<IUser>("UserCollection");

  if(validQuery.some( elem => value.query.includes(elem)) ){
    await next();
  }else{
    const findUser = await userCollection.findOne({token: ctx.request.headers.get("token") as string})
    if(findUser && findUser.token != null){
      await next();
    }else{
      ctx.response.status = 401;
      ctx.response.body = { error: "Auth error" };
    }
  } 
  
})


const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs: types,
    resolvers: resolvers,
    context: (ctx) => {
      return {
        ctx,
      }
    }
  })
  
  
  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  
  console.log("Server start at http://localhost:4000");
  await app.listen({ port: 4000 });
