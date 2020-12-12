import { argsToFieldConfigArgumentMap } from "https://deno.land/x/oak_graphql@0.6.2/graphql-tools/utils/toConfig.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { Context } from "https://deno.land/x/oak@v6.2.0/context.ts";
import db from "./mongodb.ts";
import type { ITask, IUser } from "./schemas.ts";

const taskCollection = db.collection<ITask>("TaskCollection");
const userCollection = db.collection<IUser>("UserCollection");

interface IAddTaskArgs {
    input: {
      id: string;
      name: string;
      description: string;
      date: string;
      state: string;
      reporter_mail: string;
      assignee_mail: string;
    }
  }

export const resolvers = {
    Query: {
        getTask: async (parent: any, args: any, context: {tasks:ITask[]}, info: any) => {
            const findTask = await taskCollection.findOne({id: args.id})
            if(findTask){
                return findTask;
            }else{
                console.log("Error, that task don't exists.");
            }
        },
        getTasks: async (parent: any, args: any, context: any, info: any) => {
            return await taskCollection.find();
        },
        getTaskByState: async (parent: any, args: {state: string}, context: any, info: any) => {
            const findTasks = await taskCollection.find({state: args.state});
            if((args.state = "TODO") || (args.state = "DOING") || (args.state = "DONE")){
                return findTasks;
            }else{
                console.log("These tasks doesn't exists.")
                return findTasks;
            }
        },
        getMyTasks: async (parent: any, args: {email: string}, context: any) => {
            const findUser = await userCollection.findOne({email: args.email});
            if(findUser){
                const findTask = await taskCollection.find({reporter: args.email});
                if(findTask){
                    return findTask;
                }else{
                    throw new GQLError("User don't have task.");
                }
            }else{
                throw new GQLError("User don't exist.");
            }
        },
    },
    Mutation: {
        signIn: async (parent: any, { input: {email,password}}: any, context: any, info: any) => {
            const user: Partial<IUser> = {
                email: email,
                password: password,
            }
            const repeated = await userCollection.findOne({email: email});
            if(repeated){
                throw new GQLError("User email already exist");
            }else{
                const insertUser = await userCollection.insertOne(user);
            }
            const userSelect = await userCollection.findOne({email: email});
            return userSelect;
        },
        logIn: async (parent: any, args: IUser, context: any) => {
            try{

                const findUser = await userCollection.findOne({email: args.email, password: args.password});
                if(findUser){
                    let token = "";
                    const characters = "ABCDEFGHIJKLMNOPQRSTEUVWXYZabcdefghijklmnopqrsteuvwxyz";
                    for(let i=0; i<characters.length; i++){
                        token += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    const insertToken = await userCollection.updateOne({email: args.email, password: args.password}, {$set:{token: token}});
                    return token;
                }else{
                    throw new GQLError("Account doesn't exists.")
                }

            }catch(e){
                throw new GQLError(e);
            }
        },
        logOut: async (parent: any, args: IUser, ctx: any) => {
            const findUser = await userCollection.findOne({token: args.token});
            if(findUser){
                const removeToken = await userCollection.updateOne({token: args.token}, {$set: {token: "null"}});
                console.log("Success!");
                return true;
                
            }else{
                throw new GQLError("Can't be logged out. Email/password incorrect.");
            }
        },
        deleteAccount: async (parent: any, args: IUser, context: any) => {
            const findUser = await userCollection.findOne({token: args.token});
            if(findUser){
                const removeAccount = await userCollection.deleteOne({token: args.token});
                console.log("Success!");
                return true;
            }else{
                throw new GQLError("Can't delete this account. Email/password incorrect.");
            }
        },
        addTask: async (parent: any, args: IAddTaskArgs, context: any) => {
            const findTask = await taskCollection.findOne({id: args.input.id});
            if(findTask) throw new GQLError("Task with id already exist.");

            const { id,name,description,date,state,reporter_mail,assignee_mail } = args.input;
            const task = {
                id,
                name,
                description,
                date,
                state,
                reporter_mail,
                assignee_mail,
            }
            await taskCollection.insertOne(task);
            return true;
        },
        removeTask: async (parent: any, args: { id: string }, context: any, info: any) => {
            const deleteTask = await taskCollection.deleteOne({id: args.id});
            if(deleteTask){
                return {
                    done: true,
                };
            }else{
                return {
                    done: false,
                };
            }
        },
        updateTask: async (parent: any, args: ITask, context: any, info: any) => {
            const findTask = await taskCollection.find({ id: args.id});
            if(!findTask) throw new GQLError("Task with id doesn't exist");

            const { id,name,description,date,state,reporter,assignee } = args;
            const task = {
                id,
                name,
                description,
                date,
                state,
                reporter,
                assignee,
            }
            await taskCollection.updateOne({id: args.id}, task);
            return true;
        },
        completeTask: async (parent: any, args: { id: string }, context: any, info: any) => {
            const findTask = await taskCollection.findOne({id: args.id})
            if(findTask){
                const updateTask = await taskCollection.updateOne(
                    {id: args.id},
                    {$set: {state: "DONE"}},
                );
                const taskSelect = await taskCollection.findOne({id: args.id});
                if(taskSelect){
                    return taskSelect;
                }else{
                    console.log("ERROR");
                    return taskSelect;
                }
            }else{
                console.log("Error, that task doesn't exists.");
            }
        },
        startTask: async (parent: any, args: { id: string }, context: any, info: any) => {
            const findTask = await taskCollection.findOne({id: args.id})
            if(findTask){
                const updateTask = await taskCollection.updateOne(
                    {id: args.id},
                    {$set: {state: "DOING"}},
                );
                const taskSelect = await taskCollection.findOne({id: args.id});
                if(taskSelect){
                    return taskSelect;
                }else{
                    console.log("ERROR");
                    return taskSelect;
                }
            }else{
                console.log("Error, that task doesn't exists.");
            }
        },
    },
}