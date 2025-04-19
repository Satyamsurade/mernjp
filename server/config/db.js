// import mongoose from "mongoose";

// // Function to connect to the MongoDB database
// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log('Database Connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)

// }

// export default connectDB

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Make sure this is called at the top

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('✅ MongoDB Connected'));
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export default connectDB;
