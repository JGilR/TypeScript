import { gql } from "https://deno.land/x/oak_graphql/mod.ts";
import type { Database } from "https://deno.land/x/mongo@v0.13.0/ts/database.ts";

// Schemas on MongoDB
export interface UserSchema{
    _id: { $oid: string };
    email: string,
    password: string,
    rol: string,
    token?: string,
}

export interface ClientSchema{
    _id: { $oid: string };
    email: string,
    trips?: ITrip[],
}

export interface DriverSchema{
    _id: { $oid: string };
    email: string,
    car: ICar,
    trips?: ITrip[],
}

export interface CarSchema{
    _id: { $oid: string };
    matricula: string,
    disponibility: string,
    driver: IDriver,
    trips?: ITrip[],
}

export interface TripSchema{
    _id: { $oid: string };
    driver: IDriver,
    client: IClient,
    car: ICar,
}


// Interfaces
export interface IUser{
    email: string,
    password: string,
    rol: string,
    token?: string,
}

export interface IClient{
    email: string,
    trips?: ITrip[],
}

export interface IDriver{
    email: string,
    car: ICar,
    trips?: ITrip[],
}

export interface ICar{
    matricula: string,
    disponibility: string,
    driver: IDriver,
    trips?: ITrip[],
}

export interface ITrip{
    driver: IDriver,
    client: IClient,
    car: ICar,
}

export interface IContext{
    db: Database,
    user: IUser,
    driver: IDriver,
    client: IClient,
}


export const types = gql`
type User{
    email: String!
    password: String!
    rol: String!
}

input InputUser{
    email: String!
    password: String!
    rol: String!
}

type Car{
    matricula: String!
    disp: String!
}

input InputCar{
    matricula: String!
    disp: String!
}


type ResolveType {
    done: Boolean
}

type Query {
    getCars: Boolean!
    getClients: Boolean!
    getDrivers: Boolean!
}
  
type Mutation {
    logIn(email: String!, password: String!): String!
    logOut: Boolean!

    register(email: String!, password: String!, rol: String!): Boolean!
    registerDriver(email: String!, password: String!, car: InputCar!): Boolean!
    registerClient(email: String!, password: String!): Boolean!
}

`;