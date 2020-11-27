import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export interface ITask{
    _id: { $oid: string };
    id: string;
    name: string;
    description: string;
    date: string;
    state: string;
}

export const types = gql`
type Task{
    id: String!
    name: String!
    description: String!
    date: String!
    state: String!
}

input InputTask{
    id: String!
    name: String!
    description: String!
    date: String!
    state: String!
}

type ResolveType {
    done: Boolean
}

type Query {
    getTask(id: String): Task
    getTasks: [Task]!
    getTaskByState(state: String): [Task]!
    
}
  
type Mutation {
    addTask(input: InputTask!): Task
    removeTask(id: String): ResolveType!
    completeTask(id: String): Task
    startTask(id: String): Task
}

`;
