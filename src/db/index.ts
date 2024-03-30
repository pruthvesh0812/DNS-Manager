import mongoose from 'mongoose'

// user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})

//domain schema
const domainSchema = new mongoose.Schema({
    domainName: String,
    hostedZoneId:String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    
})

// record schema
const recordSchema = new mongoose.Schema({
    recordAction:String,
    recordType: String,
    recordName: String,
    recordRoutingPolicy:String,
    ttl: Number,
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domains' }
})

const userRoleSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
    role:String
})

export const Users = mongoose.model("Users",userSchema)
export const Domains = mongoose.model("Domains",domainSchema)
export const Records = mongoose.model("Records",recordSchema)
export const UserRoles = mongoose.model("UserRoles",userRoleSchema)