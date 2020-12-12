import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export interface ITask{
    _id: { $oid: string };
    id: string;
    name: string;
    description: string;
    date: string;
    state: string;
    reporter: string,
    assignee: string,
}

export interface IUser{
    _id: { $oid: string };
    email: string,
    password: string,
    token?: string,
}

export const types = gql`
type User{
    email: String!
    password: String!
}

type Task{
    id: String!
    name: String!
    description: String!
    date: String!
    state: String!
    reporter: User!
    assignee: User!
}

input InputTask{
    id: String!
    name: String!
    description: String!
    date: String!
    state: String!
    reporter_mail: String!
    assignee_mail: String!
}

input InputUser{
    email: String!
    password: String!
}

type ResolveType {
    done: Boolean
}

type Query {
    getTask(id: String): Task
    getTasks: [Task]!
    getTaskByState(state: String): [Task]!
    getMyTasks(email: String!): [Task]!
}
  
type Mutation {
    signIn(input: InputUser!): User
    logIn(email: String!, password: String!): String!
    logOut(token: String!): Boolean!
    deleteAccount(token: String!): Boolean!
    addTask(input: InputTask!): Boolean!
    removeTask(id: String): ResolveType!
    updateTask(id: String): Boolean!
    completeTask(id: String): Task
    startTask(id: String): Task
}

`;

/*
Task:
reporter: User!
assignee: User!

InputTask:
reporter_mail: String!
assignee_mail: String!
*/
