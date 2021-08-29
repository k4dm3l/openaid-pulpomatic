import createNewUser from '../services';

const createUser = async (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Success',
    data: await createNewUser({ ...req.body }),
  });
};

export default createUser;
