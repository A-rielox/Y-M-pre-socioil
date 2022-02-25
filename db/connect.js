import mongoose from 'mongoose';

const connectDB = url => {
   return mongoose.connect(url);
};

export default connectDB;

// mongoose.connect() devuelve una promesa xeso en server.js en start() le mando await en frente
