import mongoose from 'mongoose';
import { statusList, jobTypeList } from '../utils/optionLists.js';

const JobSchema = new mongoose.Schema(
   {
      company: {
         type: String,
         required: [true, 'Please provide company name'],
         maxlength: 50,
      },
      position: {
         type: String,
         required: [true, 'Please provide position'],
         maxlength: 100,
      },
      status: {
         type: String,
         enum: statusList,
         default: 'pending',
      },

      jobType: {
         type: String,
         enum: jobTypeList,
         default: 'full-time',
      },
      jobLocation: {
         type: String,
         default: 'my city',
         required: true,
      },
      createdBy: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: [true, 'Please provide user'],
      },
   },
   { timestamps: true }
);

export default mongoose.model('Job', JobSchema);

// "jobLocation" es required y tiene default, xq al modificarlo no quiero q le pasen empty string
