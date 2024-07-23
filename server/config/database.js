import mongoose, { Mongoose } from "mongoose";

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connect to database success!!");
    }
    catch (err) {
        console.error("MongoDB connection error!!", +err);
        process.exit(1);
    }
}

export default connectDatabase;