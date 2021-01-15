import { gql } from "https://deno.land/x/oak_graphql/mod.ts";
import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";

// Schemas on MongoDB
export interface UserSchema{
    _id: { $oid: string };
    email: string,
    password: string,
    rol: string[],
    token?: string,
}

export interface BlogSchema{
    _id: { $oid: string };
    tittle: string,
    body: string,
    author: string,
    comments?: IComment[],
}


// Interfaces
export interface IUser{
    email: string,
    password: string,
    rol: string[],
    token?: string,
}

export interface IBlog{
    tittle: string,
    body: string,
    author: string,
    comments?: IComment[],
}

export interface IComment{
    body: string,
    author: string,
}

export interface IContext{
    db: Database,
    user: IUser,
}


export const types = gql`
type User{
    email: String!
    password: String!
    rol: [String]!
}

input InputUser{
    email: String!
    password: String!
    rol: [String]!
}

type Blog{
    tittle: String!
    body: String!
    author: String!
}

input InputBlog{
    tittle: String!
    body: String!
}

type Comment{
    body: String!
    author: String!
}

input InputComment{
    body: String!
}

type ResolveType {
    done: Boolean
}

type Query {
    getPosts: [Blog]!
}
  
type Mutation {
    logIn(email: String!, password: String!): String!
    logOut: Boolean!
    createUser(email: String!, password: String!, rol: [String]!): Boolean!
    deleteUser(email: String!): Boolean!

    createPost(tittle: String!, body: String!): Boolean!
    deletePost(tittle: String!): Boolean!
    createComment(tittle: String!, body: String!): Boolean!
    deleteComment(author: String!): Boolean!
}

`;

/*
    createComment
    deleteComment
*/
