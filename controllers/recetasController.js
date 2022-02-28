import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

//'/api/v1/recetas'
const createReceta = async (req, res) => {
   const { position, company } = req.body;

   if (!position || !company) {
      throw new BadRequestError('Favor proveer todos los valores');
   }

   req.body.createdBy = req.user.userId;

   // OJO q estoy pasando todo el req.body
   const job = await Job.create(req.body);

   res.status(StatusCodes.CREATED).json({ job });
};

//'/api/v1/recetas'
const deleteReceta = async (req, res) => {
   res.send('Delete Receta');
};

//'/api/v1/recetas'
const getAllRecetas = async (req, res) => {
   res.send('Get All Recetas');
};

//'/api/v1/recetas'
const updateReceta = async (req, res) => {
   res.send('Update Receta');
};

//'/api/v1/recetas'
const showStats = async (req, res) => {
   res.send('Show Stats');
};

export { createReceta, deleteReceta, getAllRecetas, updateReceta, showStats };
