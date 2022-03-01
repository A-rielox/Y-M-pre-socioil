import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

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
   const { id: jobId } = req.params;

   const job = await Job.findOne({ _id: jobId });
   if (!job) {
      throw new CustomError.NotFoundError(`No job with id : ${jobId}`);
   }

   checkPermissions(req.user, job.createdBy);

   await job.remove();

   res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
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
   const { id: jobId } = req.params;
   const { company, position } = req.body;

   // como sea lo reviso en el front
   if (!company || !position) {
      throw new BadRequestError('Please Provide All Values');
   }

   const job = await Job.findOne({ _id: jobId });
   if (!job) {
      throw new NotFoundError(`No job with id ${jobId}`);
   }

   checkPermissions(req.user, job.createdBy);

   // tecnicamente NO lo necesito en el front como respuesta, el updatedJob
   const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
   });

   res.status(StatusCodes.OK).json({ updatedJob });
};

//'/api/v1/recetas' -- route('/stats').get(showStats);
const showStats = async (req, res) => {
   res.send('Show Stats');
};

export { createReceta, deleteReceta, getAllRecetas, updateReceta, showStats };
