import mongoose from "mongoose";


const connectDatabase = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connect to database success!!");
    }
    catch (err) {
        console.error(`MongoDB connection error!!: ${err}`);
        process.exit(1);
    }
}

export default connectDatabase;