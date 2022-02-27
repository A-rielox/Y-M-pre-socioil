import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
   const authHeader = req.headers.authorization; // aquí debe venir el "Bearer <token>"

   if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('Autorización invalida');
   }

   const token = authHeader.split(' ')[1];

   try {
      // 💠 el payload del token "{ userId: this._id }"
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // crea el req.user con el _id del usuario
      req.user = { userId: payload.userId };

      next();
   } catch (error) {
      throw new UnauthenticatedError('Autorización invalida');
   }
};

export default auth;

//
// 💠 cuando se crea el token
// jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
//    expiresIn: process.env.JWT_LIFETIME,
// });

//
//    const headers = req.headers;
//    const authHeader = req.headers.authorization;
//    console.log(headers);
//    console.log(authHeader);
//
// {
// [0]   authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjFhYTE3OGZjZjc5MWNlYzcyYzg3NTUiLCJpYXQiOjE2NDU5NzkwMTYsImV4cCI6MTY0NjA2NTQxNn0.tCvI0A3Sa3fwJhmbvKW1-ubBWixgPNKILXmABwfDvtM',
// [0]   'user-agent': 'PostmanRuntime/7.29.0',
// [0]   accept: '*/*',
// [0]   'postman-token': 'f226b584-22f4-4a4c-9b9d-37ae20631a26',
// [0]   host: 'localhost:5000',
// [0]   'accept-encoding': 'gzip, deflate, br',
// [0]   connection: 'keep-alive',
// [0]   'content-length': '0'
// [0] }

// [0] Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjFhYTE3OGZjZjc5MWNlYzcyYzg3NTUiLCJpYXQiOjE2NDU5NzkwMTYsImV4cCI6MTY0NjA2NTQxNn0.tCvI0A3Sa3fwJhmbvKW1-ubBWixgPNKILXmABwfDvtM
