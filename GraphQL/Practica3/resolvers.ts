import { argsToFieldConfigArgumentMap } from "https://deno.land/x/oak_graphql@0.6.2/graphql-tools/utils/toConfig.ts";
import db from "./mongodb.ts"
import type { ITask } from "./schemas.ts"

const taskCollection = db.collection<ITask>("TaskCollection");

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
        }
    },
    Mutation: {
        addTask: async (parent: any, { input : {id,name,description,date}}: any, context: any, info: any) => {
            const task: Partial<ITask> = {
                id: id,
                name: name,
                description: description,
                date: date,
                state: "TODO",
            }
            const repeated = await taskCollection.findOne({id: id});
            if(repeated){
                console.log("Error, that task already exists.");
            }else{
                const insertTask = await taskCollection.insertOne(task);
            }

            const taskSelect = await taskCollection.findOne({id});
            return taskSelect;
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