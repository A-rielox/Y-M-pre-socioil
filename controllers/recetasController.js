import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

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
   // en "models" reviews" del e-commerce-api, tengo la explicacion de como crear los pipelines para calculateAverageRating

   let stats = await Job.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
   ]);

   // console.log(stats);
   //  [{ _id: 'pending', count: 37 },{ _id: 'declined', count: 46 },{ _id: 'interview', count: 37 }]

   // solo para cambiar el formato del object
   stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;

      return acc;
   }, {});

   // console.log(stats);
   //  { pending: 37, declined: 46, interview: 37 }

   const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
   };

   // let monthlyApplications = [];

   let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      {
         $group: {
            _id: {
               year: { $year: '$createdAt' },
               month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
         },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
   ]);
   // // console.log(monthlyApplications);
   // // [ { _id: { year: 2022, month: 2 }, count: 5 },...]

   monthlyApplications = monthlyApplications
      .map(item => {
         const {
            _id: { year, month },
            count,
         } = item;

         const date = moment()
            .month(month - 1)
            .year(year)
            .format('MMM Y');

         return { date, count };
      })
      .reverse();
   // // console.log(monthlyApplications);
   // // [{ date: 'Sep 2021', count: 3 }, ... ]

   res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createReceta, deleteReceta, getAllRecetas, updateReceta, showStats };
