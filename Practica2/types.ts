import type { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts";

//* Mongo Schemas
export interface CarSchema{
    _id: { $oid: string };
    id: number;
    seats: number;
    status: boolean;        //* Status = true, el coche esta ocupado || Status = false, el coche no esta ocupado
    client?: number;
}

export interface ClientSchema{
    _id: { $oid: string };
    id: number;
    people: number;
}

//* Data types
export interface ICar{
    id: number;
    seats: number;
    status: boolean;
    client?: number;
}

export interface IClient{
    id: number;
    people: number
}

export type IContext = Context<Record<string, any>>;