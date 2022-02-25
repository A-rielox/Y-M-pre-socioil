// '/api/v1/auth'
const register = async (req, res) => {
   res.send('Register');
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
