import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";
import { types } from "./schemas.ts"
import { resolvers } from "./resolvers.ts"

const app = new Application();

const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs: types,
    resolvers: resolvers,
    context: (ctx) => {}
  })
  
  
  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
  
  console.log("Server start at http://localhost:4000");
  await app.listen({ port: 4000 });
