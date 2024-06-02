import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // const connectionInstance = await mongoose.connect(`process.env.MONGO_URI/${dbName}`)     
        await mongoose.connect("mongodb+srv://niteshsinghal9917:bzDCS9Hmf6EOvXxP@cluster0.si0lxp7.mongodb.net/AutomatedTT")    
        
        console.log(`Database Connected `);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB