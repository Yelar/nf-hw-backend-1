import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://Yelarys:zh7xVDU_Av7NPJU@backend.aygrmmc.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=backend');
        console.log('MongoDB connected...');
    } catch (err:any) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;