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
// .route('/updateUser').patch(authenticateUser, updateUser);
const updateUser = async (req, res) => {
   const { email, name, lastName, location } = req.body;

   if (!email || !name || !lastName || !location) {
      throw new BadRequestError('Favor de proveer todos los valores');
   }

   const user = await User.findOne({ _id: req.user.userId });

   user.email = email;
   user.name = name;
   user.lastName = lastName;
   user.location = location;

   await user.save();

   const token = user.createJWT(); // tecnicamente no cambio el id, asi q no necesito cambiar el token

   res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export { register, login, updateUser };

//
// en el blog q hice, para hacer update ponia, lo de abajo para actualizar todo lo q se pusiera en el req.body, pero me arriesgo a q ponga algo ( de alguna forma ) como si es admin o algo q no debe, DE LA FORMA DE AQUI ARRIBA SOLO ACTUALIZO LAS Q YO PONGO ACÁ 😭😭😭😭😭.
//
//UPDATE POST ⭐⭐⭐ SU FORMA DE HACER LOS UPDATES SON CHINGONAS -- '/api/posts'
// router.put('/:id', async (req, res) => {
//    try {
//       const post = await Post.findById(req.params.id);

//       if (post.username === req.body.username) {
//          try {
//             const updatedPost = await Post.findByIdAndUpdate(
//                req.params.id,
//                { $set: req.body },
//                { new: true }
//             );

//             res.status(200).json(updatedPost);
//          } catch (err) {
//             res.status(500).json(err);
//          }
//       } else {
//          res.status(401).json('You can update only your post!');
//       }
//    } catch (err) {
//       res.status(500).json(err);
//    }
// });
