import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import type { IContext, IBlog, IUser, UserSchema, BlogSchema, IComment } from "../schemas.ts"
import db from "../mongodb.ts";

const blogCollection = db.collection<BlogSchema>("BlogCollection");
const userCollection = db.collection<UserSchema>("UserCollection");


const Mutation = {

    logIn: async (parent: any, args: { email: string, password: string }, ctx: IContext): Promise<string> => {
        try{

            const findUser = await userCollection.findOne({email: args.email, password: args.password});
            if(findUser){
                const token = v4.generate();
                await userCollection.updateOne({email: args.email}, {$set: {token}});
                return token;
            }else{
                throw new GQLError("Invalid user or password.");
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    logOut: async (parent: any, args: {}, ctx: IContext): Promise<Boolean> => {
        try{

            const findUser = await userCollection.findOne({email: ctx.user.email, token: ctx.user.token});
            if(findUser){
                await userCollection.updateOne({email: ctx.user.email}, {$set: { token: "" }});
                return true;
            }else{
                throw new GQLError("Unexpected Error.");
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    createUser: async (parent: any, args: {email: string, password: string, rol: string[]}, ctx: IContext): Promise<Boolean> => {
        try{

            const findUser = await userCollection.findOne({email: args.email});
            if(findUser){
                throw new GQLError(`User with email ${args.email} already exists.`);
            }
            await userCollection.insertOne({ email: args.email, password: args.password, rol: args.rol });
            return true;

        }catch (e){
            throw new GQLError(e);
        }
    },

    deleteUser: async (parent: any, args: {email: string}, ctx: IContext): Promise<Boolean> => {
        try{

            const findUser = await userCollection.findOne({ email: args.email });
            if(findUser){
                const deleteUser = await userCollection.deleteOne({ email: args.email })
                return true;
            }else{
                throw new GQLError("User doesnt exists.");
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    createPost: async (parent: any, args: {tittle: string, body: string}, ctx: IContext): Promise<Boolean> => {
        try{

            const findPost = await blogCollection.findOne({ tittle: args.tittle });
            if(findPost){
                throw new GQLError(`Post with tittle ${args.tittle} already exists.`);
            }else{
                await blogCollection.insertOne({ tittle: args.tittle, body: args.body, author: ctx.user.email });
                return true;
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    deletePost: async (parent: any, args: {tittle: string}, ctx: IContext): Promise<Boolean> => {
        try{

            if(ctx.user.rol.includes("EDITOR")){
                await blogCollection.deleteOne({ tittle: args.tittle });
                return true;
            }else{
                const findPost = await blogCollection.findOne({ tittle: args.tittle });
                if(findPost){
                    if(findPost.author === ctx.user.email){
                        await blogCollection.deleteOne({ tittle: args.tittle });
                        return true;
                    }else{
                        throw new GQLError(`You dont have permission to delete that Post.`);
                    }
                    
                }else{
                    throw new GQLError(`Post with tittle ${args.tittle} doesnt exists.`);
                }
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    createComment: async (parent: any, args: {tittle: string, body: string}, ctx: IContext): Promise<Boolean> => {
        try{

            const findPost = await blogCollection.findOne({ tittle: args.tittle });
            if(findPost){
                //const comments = findPost.comments;
                //comments?.push({body: args.body, author: ctx.user.email});
                const newComment = {
                    body: args.body,
                    author: ctx.user.email,
                }
                
                await blogCollection.updateOne({ tittle: args.tittle }, {$set: { comments: [newComment] } });
                return true;
            }else{
                throw new GQLError(`Post with tittle ${args.tittle} already exists.`);
            }

        }catch (e){
            throw new GQLError(e);
        }
    },

    /*
    deleteComment: async (parent: any, args: {author: string}, ctx: IContext): Promise<Boolean> => {
        try{

            if(ctx.user.rol.includes("EDITOR")){

                await blogCollection.deleteOne({ author: args.author });
                return true;
            }else{
                const findPost = await blogCollection.findOne({ tittle: args.tittle });
                if(findPost){
                    if(findPost.author === ctx.user.email){
                        await blogCollection.deleteOne({ tittle: args.tittle });
                        return true;
                    }else{
                        throw new GQLError(`You dont have permission to delete that Post.`);
                    }
                    
                }else{
                    throw new GQLError(`Post with tittle ${args.tittle} doesnt exists.`);
                }
            }

        }catch (e){
            throw new GQLError(e);
        }
    },
    */

}

export { Mutation };

