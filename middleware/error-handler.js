import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
   const defaultError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong, try again later',
   };

   // 🌀
   if (err.name === 'ValidationError') {
      defaultError.msg = Object.values(err.errors)
         .map(item => item.message)
         .join(',');

      defaultError.statusCode = StatusCodes.BAD_REQUEST;
   }

   // x si esta repetido el email o cualquiera de las unique de Schema 💫
   if (err.code && err.code === 11000) {
      defaultError.msg = `Duplicate value entered for ${Object.keys(
         err.keyValue
      )} field, please choose another value`;

      defaultError.statusCode = StatusCodes.BAD_REQUEST;
   }

   return res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;

// 🌀
// el q envia mongoose cuando faltan los campos requridos, como sea checo en el controller si falta alguno x lo q este error no deberia de saltar, ya q el otro lo agarra antes de enviar a mongoDB
// el de mi controlador me va a tirar el generico de 'Favor rellenar todos los valores'

// 💫
// tambien ya reviso duplicado de email en el controller por lo q ese debe saltar primero
