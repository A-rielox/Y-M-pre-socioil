import User from '../models/Users.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

// '/api/v1/auth'
const register = async (req, res) => {
   const { name, email, password } = req.body;
   console.log(name, email, password);

   if (!name || !email || !password) {
      throw new BadRequestError('Favor rellenar todos los valores');
   }

   const userAlreadyExist = await User.findOne({ email });
   if (userAlreadyExist) {
      throw new BadRequestError('Este email ya está registrado');
   } // como sea es Unique en el schema

   const user = await User.create({ name, email, password });

   // en el payload del token { userId: this._id }
   const token = user.createJWT();

   res.status(StatusCodes.CREATED).json({
      user: {
         email: user.email,
         lastName: user.lastName,
         location: user.location,
         name: user.name,
      },
      token,
      location: user.location,
   });
};

// '/api/v1/auth'
const login = async (req, res) => {
   res.send('Login');
};

// '/api/v1/auth'
const updateUser = async (req, res) => {
   res.send('Update User');
};

export { register, login, updateUser };
