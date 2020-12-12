import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

interface IContext {
    db: Database
  }
  
  interface IUser{
    name: string,
    email: string
  }

const Task = {
    assignee: async (
      parent: {assignee: string},
      args: any,
      ctx: IContext
    ): Promise<IUser | null> => {
      const db: Database = ctx.db;
      const UsersCollection = db.collection<IUser>("Users");
      const user = await UsersCollection.findOne({ email: parent.assignee })
      return user;
    },
  
    reporter: async (
      parent: {reporter: string},
      args: any,
      ctx: IContext
    ): Promise<IUser | null> => {
      const db: Database = ctx.db;
      const UsersCollection = db.collection<IUser>("Users");
      const user = await UsersCollection.findOne({ email: parent.reporter })
      return user;
    }
  }
  
  export {Task}