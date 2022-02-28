import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';

//'/api/v1/recetas' -- .post(createReceta)
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

//'/api/v1/recetas' -- .route('/:id').delete(deleteReceta)
const deleteReceta = async (req, res) => {
   res.send('Delete Receta');
};

//'/api/v1/recetas' --  .get(getAllRecetas)
const getAllRecetas = async (req, res) => {
   const jobs = await Job.find({ createdBy: req.user.userId });

   res.status(StatusCodes.OK).json({
      jobs,
      totalJobs: jobs.length,
      numOfPages: 1,
   });
};

//'/api/v1/recetas' -- .route('/:id').patch(updateReceta)
const updateReceta = async (req, res) => {
   res.send('Update Receta');
};

//'/api/v1/recetas' -- route('/stats').get(showStats);
const showStats = async (req, res) => {
   res.send('Show Stats');
};

export { createReceta, deleteReceta, getAllRecetas, updateReceta, showStats };
