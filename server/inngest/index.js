import { Inngest } from "inngest";
import { User } from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "vibehub-app" });

// Add user to Database

const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: "clerk/user.created" },
  async ({ event}) => {
    const {id,first_name,last_name,email_addresses, image_url} = event.data
    username = email_addresses[0].email_address.split('@')[0]

    let user = await User.findOne({username})

    if(user){
        username  = username + Math.floor(Math.random()*10000)
    }

    const userdata = {
        _id :id,
        email :email_addresses[0].email_address,
        full_name:first_name+" "+last_name,
        profile_picture:image_url,
        username
    }
    await User.create(userdata)
  },
)


// Inngest function to update data in database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: "clerk/user.updated" },
  async ({ event}) => {
    const {id,first_name,last_name,email_addresses, image_url} = event.data
    

    const updatedUserdata = {
        email :email_addresses[0].email_address,
        full_name:first_name+" "+last_name,
        profile_picture:image_url,
    }
    await User.findOneAndUpdate(id,updatedUserdata)
  },
)

// Inngest function to delete User
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: "clerk/user.deleted" },
  async ({ event}) => {
    const {id} = event.data
    

    
    await User.findByIdAndDelete(id)
  },
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];