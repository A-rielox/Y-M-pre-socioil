import User from '../models/Users.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

// '/api/v1/auth/register'
const register = async (req, res) => {
   const { name, email, password } = req.body;

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

// '/api/v1/auth/login' -- post
const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new BadRequestError('Favor proveer todos los campos');
   }

   const user = await User.findOne({ email }).select('+password');
   if (!user) {
      throw new UnauthenticatedError('Credenciales invalidas');
   }

   const isPasswordCorrect = await user.comparePassword(password);
   if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Credenciales invalidas');
   }

   const token = user.createJWT();
   user.password = undefined;

   res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

// '/api/v1/auth'
const updateUser = async (req, res) => {
   res.send('Update User');
};

export { register, login, updateUser };
