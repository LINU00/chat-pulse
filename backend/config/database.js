import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        // If Database is not connected exit it.
        process.exit(1);
    }
};

export default connectDB;