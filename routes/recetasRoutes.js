import express from 'express';
const router = express.Router();
   
import {
   createReceta,
   deleteReceta,
   getAllRecetas,
   updateReceta,
   showStats,
} from '../controllers/recetasController.js';

//'/api/v1/recetas'
router.route('/').post(createReceta).get(getAllRecetas);
router.route('/stats').get(showStats);

router.route('/:id').delete(deleteReceta).patch(updateReceta);

export default router;
