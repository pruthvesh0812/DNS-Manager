import { NextFunction, Request, Response } from 'express'
import { jwtVerify, type JWTPayload } from 'jose';
import { Users } from '../db'
import { userType } from '../req';



export const authenticateLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.cookies['userToken']
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token: string = authHeader.split(' ')[1];
        if (token) {
            //verify user
            try{const user = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET))
            console.log('user', user)
            const { email, password } = user.payload

            // UPDATE: this code has been moved to /auth/login route

            //check if user still exists to maintain consistency - 
            const userFromDB = await Users.findOne({ email, password });
            if (userFromDB) {
                console.log(userFromDB, "user from db")
                    req.user = {email:userFromDB.email as string, password:userFromDB.password as string,_id:userFromDB._id} || undefined
                // res.cookie('user', `${userFromDB}`, {maxAge: 36000000, httpOnly: true, path: '/'})
            }
            else {
                return res.status(404).json({ message: "user does not exists" })
            }
            next()}
            catch(err){
                res.status(401).json({message:"session expired"})
            }
        }
        else {
            return res.status(401).json({ message: "unauthorized" })
        }
    }


}