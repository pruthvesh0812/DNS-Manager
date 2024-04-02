// custom.d.ts or any other .ts file in your project
import { Request } from 'express';
import { Types } from 'mongoose';

type userType ={
    email:string,
    password:string,
    _id:Types.ObjectId,
    userRole?:string
}

declare module 'express-serve-static-core' {
 interface Request {
    user?: userType; // Replace 'any' with the actual type of your user object
 }
}
