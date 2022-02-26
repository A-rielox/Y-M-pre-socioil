import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import 'express-async-errors';
import morgan from 'morgan';

//===== ROUTERS
import authRouter from './routes/authRoutes.js';
import recetasRouter from './routes/recetasRoutes.js';

dotenv.config();
const app = express();

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
if (process.env.NODE_ENV !== 'production') {
   app.use(morgan('dev'));
}
app.use(express.json()); // acceso al req.body

app.get('/', (req, res) => {
   res.send('<h1>Bienvenido a Socioil media</h1>');
});

//===== ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recetas', recetasRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 5000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URL);

      app.listen(port, () =>
         console.log(`Server es listening in port: ${port}.....🐸`)
      );
   } catch (error) {
      console.log(error);
   }
};
// connectDB devuelve una promesa xeso es con await y la fcn es async

start();
