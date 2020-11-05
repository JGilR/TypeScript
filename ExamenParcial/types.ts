import type { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts";

// Mongo Schema
export interface ClientSchema{
    _id: { $oid: string };
    cif: string;
    name: string;
    address: string;
    phone: string;
    mail: string;
}

export interface ProductSchema{
    _id: { $oid: string };
    sku: string;
    name: string;
    price: number;
}

export interface InvoiceSchema{
    _id: { $oid: string };
    client_cif: string;
    products:Iproducts[];
}

export interface productsSchema{
    sku: string;
    amount: number;
}

// Interfaces
export interface IClient{
    cif: string;
    name: string;
    address: string;
    phone: string;
    mail: string;
}

export interface IProduct{
    sku: string;
    name: string;
    price: number;
}

export interface IInvoice{
    client_cif: string;
    products:Iproducts[];
}

export interface Iproducts{
    sku: string;
    amount: number;
}

export type IContext = Context<Record<string, any>>;