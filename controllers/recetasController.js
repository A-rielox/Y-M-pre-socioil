//'/api/v1/recetas'
const createReceta = async (req, res) => {
   res.send('Create Receta gg');
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
