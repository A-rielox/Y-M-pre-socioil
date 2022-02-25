import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.get('/', (req, res) => {
   throw new Error('error error error');
   res.send('<h1>Bienvenido a Socioil media</h1>');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log(`server running on port ${port}....🐸`);
});
