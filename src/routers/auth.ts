import express, { NextFunction, Request, Response } from 'express'
import { authInputSchema } from '../utils/inputVal'
import { UserRoles, Users } from '../db'
import { generateToken } from '../utils/generateToken'
import { authenticateLoggedIn } from '../middlewares'
import { userType } from '../req'

const router = express.Router()

// signup route
router.post("/signup", async (req: Request, res: Response) => {
    console.log("reaching signup")
    const parsedInputSchema = authInputSchema.safeParse(req.body);
    if (!parsedInputSchema.success) {
        return res.status(400).json({ message: "Bad request, Wrong input", error: parsedInputSchema.error });
    }
    else {
        const { email, password } = parsedInputSchema.data
        const user = await Users.findOne({ email, password });
        if (user) {
            return res.status(409).json({ message: "user already exists" });
        }
        else {
            const newUser = new Users({ email, password });
            await newUser.save();
           
            const token = await generateToken({ email, password })
            // attach user to cookie
            // res.cookie('user', JSON.stringify(user), {maxAge: 36000000, httpOnly: true, path: '/'})

            res.cookie('userToken', `${token}`, { maxAge: 36000000, httpOnly:true});
            // res.setHeader('Set-Cookie', `userToken=${token}; HttpOnly; Path=/ ; Max-age=36000000`)
            return res.status(200).json({ message: "user created successfully", token: token })
        }
    }
})

router.post("/login", async (req: Request, res: Response) => {
    console.log("login1")
    const parsedInputSchema = authInputSchema.safeParse(req.body);
    if (!parsedInputSchema.success) {
        return res.status(400).json({ message: "Bad request, Wrong input", error: parsedInputSchema.error });
    }
    else {
    console.log("login2")

        const { email, password } = parsedInputSchema.data
        const user = await Users.findOne({ email, password });
        if (user) {
    console.log("login3")

            const token = await generateToken({ email, password})
            res.cookie('userToken', `${token}`, { maxAge: 36000000, httpOnly:true}); //httpOnly client side js cant access cookie
            // res.setHeader('Set-Cookie', `userToken=${token}; HttpOnly; Path=/ ; Max-age=36000000`) 
    console.log("login4")
            
            // attach user to cookie
            // res.cookie('user', JSON.stringify(user), {maxAge: 36000000, httpOnly: true, path: '/'})
            console.log("login5")

            const userRole = await UserRoles.findById({_id:user._id}) 
            let role = ''
            if(userRole){
    console.log("login6")

                res.cookie('userRole',`${userRole.role}`,{maxAge:36000000,httpOnly:true});
                role = userRole.role as string
            }
            else{
                res.cookie('userRole','',{maxAge:36000000,httpOnly:true});
            }
    console.log("login7")
            
            return res.status(200).json({ message: "logged in successfully", token: token , userRole:role})
        }
        else {
            return res.status(404).json({ message: "user not found" });
        }
    }
})

router.post("/setUserRole",authenticateLoggedIn, async (req: Request, res: Response) => {
    
     const { email, password, _id } = req.user as userType
    //  console.log(req.cookies, _id)
     const { userRole } = req.body;
   
    try{  
            const newRole = new UserRoles({userId:_id,role:userRole});
            await newRole.save();
            res.cookie('userRole',`${userRole}`,{maxAge:36000000,httpOnly:true});
            res.status(200).json({message:"user role set successfully"})   
    }
    catch(err){
        console.log(err,"error in creating role")
        res.status(500).json({error:"Internal server error while creating user role"})
    }
   
})

export default router


