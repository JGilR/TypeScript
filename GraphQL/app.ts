import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql, GQLError } from "https://deno.land/x/oak_graphql/mod.ts";

const app = new Application();

interface IUser{
    firstName: string;
    lastName: string;
    id: string;
}

const users: IUser[] = [];

const types = gql`
type User {
  firstName: String
  lastName: String
}

input UserInput {
  firstName: String
  lastName: String
  id: String
}

type ResolveType {
  done: Boolean
}

type Query {
  getUser(id: String): User 
  getUsers: [User]!
}

type Mutation {
  setUser(input: UserInput!): ResolveType!
  clearUsers: ResolveType!
}
`;

const resolvers = {
  Query: {
    getUser: (parent: any, args: {id:string}, context: {users:IUser[]}, info: any) => {
      const users = context.users;
      const user: IUser | undefined = users.find(usr => usr.id === args.id);
      return user;
    },
    getUsers: (parent: any, args: any, context: {users:IUser[]}, info: any) => {
        return context.users;
    },
  },
  Mutation: {
    setUser: (parent: any, args: any, context: {users:IUser[]}, info: any) => {
        const users: IUser[] = context.users;
        users.push(args.input);
      return {
        done: true,
      };
    },
    clearUsers: (parent: any, args: any, context: {users:IUser[]}, info: any) => {
        context.users = [];
        return {done: true};
    },
  },
};

app.use(async (ctx, next) => {
  console.log(ctx.request.headers.get("token"));
  const value = await ctx.request.body().value;
  console.log(value);
  const validQuery = ["login", "signin"];

  if(validQuery.some( elem => value.query.includes("login")) ){
    await next();
  }else{
    if(ctx.request.headers.get("token") == "12345" || true){
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
  context: (ctx: RouterContext) => {
    return { users };
  }
})


app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:4000");
await app.listen({ port: 4000 });